import * as THREE from "./vendor/three.module.js";

const viewers = new Map();

function parseAsciiSTL(text) {
  const vertices = [];
  const normals = [];
  const normalPattern = /facet\s+normal\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/g;
  const vertexPattern = /vertex\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/g;
  let normalMatch;
  let vertexMatch;
  const faceNormals = [];

  while ((normalMatch = normalPattern.exec(text))) {
    faceNormals.push([
      Number(normalMatch[1]),
      Number(normalMatch[2]),
      Number(normalMatch[3])
    ]);
  }

  let vertexIndex = 0;
  while ((vertexMatch = vertexPattern.exec(text))) {
    const faceNormal = faceNormals[Math.floor(vertexIndex / 3)] || [0, 0, 1];
    vertices.push(Number(vertexMatch[1]), Number(vertexMatch[2]), Number(vertexMatch[3]));
    normals.push(faceNormal[0], faceNormal[1], faceNormal[2]);
    vertexIndex += 1;
  }

  return buildGeometry(vertices, normals);
}

function parseBinarySTL(buffer) {
  const view = new DataView(buffer);
  const faceCount = view.getUint32(80, true);
  const expectedLength = 84 + faceCount * 50;
  if (expectedLength > buffer.byteLength) {
    throw new Error("STL 文件长度不完整");
  }

  const vertices = new Float32Array(faceCount * 9);
  const normals = new Float32Array(faceCount * 9);
  let offset = 84;

  for (let face = 0; face < faceCount; face += 1) {
    const nx = view.getFloat32(offset, true);
    const ny = view.getFloat32(offset + 4, true);
    const nz = view.getFloat32(offset + 8, true);
    offset += 12;

    for (let vertex = 0; vertex < 3; vertex += 1) {
      const base = face * 9 + vertex * 3;
      vertices[base] = view.getFloat32(offset, true);
      vertices[base + 1] = view.getFloat32(offset + 4, true);
      vertices[base + 2] = view.getFloat32(offset + 8, true);
      normals[base] = nx;
      normals[base + 1] = ny;
      normals[base + 2] = nz;
      offset += 12;
    }

    offset += 2;
  }

  return buildGeometry(vertices, normals);
}

function buildGeometry(vertices, normals) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(
    vertices instanceof Float32Array ? vertices : new Float32Array(vertices),
    3
  ));
  geometry.setAttribute("normal", new THREE.BufferAttribute(
    normals instanceof Float32Array ? normals : new Float32Array(normals),
    3
  ));
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  geometry.computeVertexNormals();
  return geometry;
}

function looksAscii(buffer) {
  const prefix = new TextDecoder().decode(buffer.slice(0, Math.min(160, buffer.byteLength)));
  return prefix.trimStart().startsWith("solid");
}

async function loadSTL(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`无法加载 STL: ${response.status}`);
  }
  const buffer = await response.arrayBuffer();
  if (looksAscii(buffer)) {
    const text = new TextDecoder().decode(buffer);
    if (/facet\s+normal/.test(text)) {
      return parseAsciiSTL(text);
    }
  }
  return parseBinarySTL(buffer);
}

function fitCamera(camera, object, container) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = maxDim / (2 * Math.tan((camera.fov * Math.PI) / 360));
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = distance * 100;
  camera.position.set(center.x + distance * 0.82, center.y - distance * 1.35, center.z + distance * 0.8);
  camera.up.set(0, 0, 1);
  camera.lookAt(center);
  camera.updateProjectionMatrix();
  return { center, distance };
}

function disposeViewer(container) {
  const existing = viewers.get(container);
  if (!existing) return;
  cancelAnimationFrame(existing.frame);
  existing.dragController?.dispose();
  existing.resizeObserver.disconnect();
  existing.renderer.dispose();
  existing.container.innerHTML = "";
  viewers.delete(container);
}

export function unmountSTLViewer(container) {
  disposeViewer(container);
}

function createDragController(container, mesh, camera, cameraState) {
  const state = {
    pointerDown: false,
    lastX: 0,
    lastY: 0,
    velocityX: 0.004,
    velocityY: 0,
    distanceScale: 1
  };

  function onPointerDown(event) {
    state.pointerDown = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    container.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!state.pointerDown) return;
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.velocityX = dx * 0.006;
    state.velocityY = dy * 0.004;
    mesh.rotation.z += state.velocityX;
    mesh.rotation.y = THREE.MathUtils.clamp(mesh.rotation.y + state.velocityY, -0.55, 0.55);
  }

  function onPointerUp(event) {
    state.pointerDown = false;
    container.releasePointerCapture?.(event.pointerId);
  }

  function onWheel(event) {
    event.preventDefault();
    const direction = Math.sign(event.deltaY);
    state.distanceScale = THREE.MathUtils.clamp(state.distanceScale + direction * 0.08, 0.45, 2.2);
    const { center, distance } = cameraState;
    camera.position.set(center.x + distance * 0.82 * state.distanceScale, center.y - distance * 1.35 * state.distanceScale, center.z + distance * 0.8 * state.distanceScale);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }

  container.addEventListener("pointerdown", onPointerDown);
  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerup", onPointerUp);
  container.addEventListener("pointercancel", onPointerUp);
  container.addEventListener("wheel", onWheel, { passive: false });

  return {
    update() {
      if (state.pointerDown) return;
      mesh.rotation.z += state.velocityX;
      mesh.rotation.y = THREE.MathUtils.clamp(mesh.rotation.y + state.velocityY, -0.55, 0.55);
      state.velocityX *= 0.985;
      state.velocityY *= 0.94;
      if (Math.abs(state.velocityX) < 0.0018) state.velocityX = 0.0018;
    },
    dispose() {
      container.removeEventListener("pointerdown", onPointerDown);
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      container.removeEventListener("wheel", onWheel);
    }
  };
}

export async function mountSTLViewer(container, options) {
  disposeViewer(container);
  container.innerHTML = "";

  const status = document.createElement("div");
  status.className = "stl-status";
  status.textContent = "正在加载 STL 模型";
  container.appendChild(status);

  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf7f1e6, 1);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7f1e6, 160, 520);

    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.01, 2000);

    const ambient = new THREE.HemisphereLight(0xffffff, 0x6d715f, 2.3);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(90, -120, 180);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffe9c6, 1.2);
    fill.position.set(-110, 80, 120);
    scene.add(fill);

    const geometry = await loadSTL(options.src);
    geometry.center();
    const material = new THREE.MeshStandardMaterial({
      color: options.color || 0xd9c7a5,
      roughness: 0.72,
      metalness: 0.08
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry, 18),
      new THREE.LineBasicMaterial({ color: 0x4f5f47, transparent: true, opacity: 0.18 })
    );
    scene.add(edges);

    const grid = new THREE.GridHelper(180, 18, 0xb9ad99, 0xd7cbb8);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -2;
    scene.add(grid);

    status.remove();
    container.appendChild(renderer.domElement);

    const toolbar = document.createElement("div");
    toolbar.className = "stl-toolbar";
    toolbar.innerHTML = `
      <span class="stl-chip">${options.label || "STL 模型"}</span>
      <span class="stl-chip">拖拽旋转 · 滚轮缩放</span>
    `;
    container.appendChild(toolbar);

    const cameraState = fitCamera(camera, mesh, container);
    const dragController = createDragController(container, mesh, camera, cameraState);

    const resizeObserver = new ResizeObserver(() => {
      if (!container.clientWidth || !container.clientHeight) return;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(container);

    const state = { container, renderer, frame: 0, resizeObserver, dragController };
    function tick() {
      dragController.update();
      renderer.render(scene, camera);
      state.frame = requestAnimationFrame(tick);
    }
    tick();
    viewers.set(container, state);
  } catch (error) {
    status.innerHTML = `
      <span>
        ${error.message || "STL 模型加载失败"}<br>
        <a href="${options.src}" style="color:#243629;text-decoration:underline">下载 STL 文件</a>
      </span>
    `;
  }
}
