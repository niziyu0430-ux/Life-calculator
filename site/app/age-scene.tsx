'use client';
import { useEffect, useRef, useState } from 'react';
const anchors = [1, 8, 16, 25, 45, 65, 85];
export default function AgeScene({
  en = false,
  gameAge,
  character = 0,
}: {
  en?: boolean;
  gameAge?: number;
  character?: 0 | 1;
}) {
  const host = useRef<HTMLDivElement>(null),
    view = useRef<HTMLDivElement>(null);
  const [person, setPerson] = useState<0 | 1>(character),
    [age, setAge] = useState(gameAge ?? 1),
    [playing, setPlaying] = useState(false),
    [visible, setVisible] = useState(false),
    [status, setStatus] = useState<'waiting' | 'loading' | 'ready' | 'failed'>(
      'waiting',
    );
  const current = useRef({
    age: gameAge ?? 1,
    playing: false,
    visible: false,
    opacity: 1,
    reduced: false,
  });
  const reset = useRef<() => void>(() => {});
  const game = gameAge !== undefined;
  const t = (a: string, b: string) => (en ? b : a);
  useEffect(() => {
    setPerson(character);
  }, [character]);
  useEffect(() => {
    if (gameAge !== undefined) {
      setAge(gameAge);
      current.current.age = gameAge;
    }
  }, [gameAge]);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const show = entries[0].isIntersecting;
        current.current.visible = show;
        setVisible((v) => v || show);
      },
      { rootMargin: '120px' },
    );
    observer.observe(node);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    current.current.reduced = reduced.matches;
    if (!game && !reduced.matches) {
      setPlaying(true);
      current.current.playing = true;
    }
    const change = () => {
      current.current.reduced = reduced.matches;
      if (reduced.matches) {
        setPlaying(false);
        current.current.playing = false;
      }
    };
    reduced.addEventListener('change', change);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', change);
    };
  }, [game]);
  useEffect(() => {
    if (!visible || !view.current) return;
    let disposed = false,
      cleanup = () => {};
    setStatus('loading');
    void (async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } =
          await import('three/addons/loaders/GLTFLoader.js');
        const { OrbitControls } =
          await import('three/addons/controls/OrbitControls.js');
        if (disposed) return;
        const container = view.current!;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#f2e5d8');
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: false,
          powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.setClearColor('#f2e5d8');
        container.appendChild(renderer.domElement);
        renderer.domElement.setAttribute(
          'aria-label',
          en ? 'Rotatable three-dimensional character' : '可以旋转的三维人物',
        );
        renderer.domElement.setAttribute('role', 'img');
        const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);
        camera.position.set(0, 1.25, 4.5);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0.9, 0);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 2.8;
        controls.maxDistance = 8;
        controls.minPolarAngle = 0.3;
        controls.maxPolarAngle = Math.PI * 0.82;
        renderer.domElement.tabIndex = 0;
        const keyControl = (e: KeyboardEvent) => {
          if (!['ArrowLeft', 'ArrowRight', '+', '-', '='].includes(e.key))
            return;
          e.preventDefault();
          const offset = camera.position.clone().sub(controls.target);
          if (e.key.startsWith('Arrow'))
            offset.applyAxisAngle(
              new THREE.Vector3(0, 1, 0),
              e.key === 'ArrowLeft' ? 0.18 : -0.18,
            );
          else
            offset.setLength(
              THREE.MathUtils.clamp(
                offset.length() * (e.key === '-' ? 1.12 : 0.89),
                controls.minDistance,
                controls.maxDistance,
              ),
            );
          camera.position.copy(controls.target).add(offset);
          controls.update();
        };
        renderer.domElement.addEventListener('keydown', keyControl);
        reset.current = () => {
          camera.position.set(0, 1.25, 4.5);
          controls.target.set(0, 0.9, 0);
          controls.update();
        };
        scene.add(new THREE.HemisphereLight('#fff5e8', '#87624a', 2.4));
        const light = new THREE.DirectionalLight('#fff4e6', 3.4);
        light.position.set(3, 5, 4);
        scene.add(light);
        const rim = new THREE.DirectionalLight('#efbf95', 1.1);
        rim.position.set(-3, 2, -2);
        scene.add(rim);
        let model: import('three').Object3D | undefined;
        let mixer: import('three').AnimationMixer | undefined;
        let frame = 0,
          last = 0,
          elapsed = 0,
          announced = 0;
        const resize = () => {
          const w = container.clientWidth,
            h = container.clientHeight || 380;
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
        };
        const observer = new ResizeObserver(resize);
        observer.observe(container);
        resize();
        const resetClock = () => {
          last = 0;
        };
        document.addEventListener('visibilitychange', resetClock);
        const fail = () => setStatus('failed');
        renderer.domElement.addEventListener('webglcontextlost', fail);
        cleanup = () => {
          cancelAnimationFrame(frame);
          document.removeEventListener('visibilitychange', resetClock);
          observer.disconnect();
          controls.dispose();
          mixer?.stopAllAction();
          model?.traverse((object) => {
            const mesh = object as import('three').Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            materials.filter(Boolean).forEach((material) => {
              Object.values(material).forEach((v) => {
                if (v instanceof THREE.Texture) v.dispose();
              });
              material.dispose();
            });
          });
          renderer.domElement.removeEventListener('webglcontextlost', fail);
          renderer.domElement.removeEventListener('keydown', keyControl);
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };
        const gltf = await new GLTFLoader().loadAsync(
          `/models/character-${person}.glb`,
        );
        if (disposed) {
          gltf.scene.traverse((o) => {
            const m = o as import('three').Mesh;
            m.geometry?.dispose();
          });
          return;
        }
        model = gltf.scene;
        scene.add(model);
        mixer = new THREE.AnimationMixer(model);
        for (const clip of gltf.animations) mixer.clipAction(clip).play();
        setStatus('ready');
        const skin = [] as {
          mesh: import('three').Mesh;
          names: Record<string, number>;
          weights: number[];
        }[];
        const hair = [] as import('three').MeshStandardMaterial[];
        model.traverse((o) => {
          const mesh = o as import('three').Mesh;
          if (mesh.morphTargetDictionary && mesh.morphTargetInfluences)
            skin.push({
              mesh,
              names: mesh.morphTargetDictionary,
              weights: mesh.morphTargetInfluences,
            });
          const materials = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const mat of materials) {
            if (mat && /hair/i.test(mat.name) && 'color' in mat)
              hair.push(mat as import('three').MeshStandardMaterial);
          }
        });
        const dark = new THREE.Color(person === 0 ? '#594036' : '#704938'),
          gray = new THREE.Color('#d6c7b5');
        const animate = (now: number) => {
          frame = requestAnimationFrame(animate);
          const dt = last ? Math.max(0, (now - last) / 1000) : 0;
          last = now;
          if (!current.current.visible || document.hidden) return;
          if (current.current.playing && !game) {
            elapsed = (elapsed + dt) % 35;
            current.current.age = 1 + Math.min(elapsed / 33, 1) * 84;
            current.current.opacity = elapsed > 33 ? Math.abs(elapsed - 34) : 1;
            if (now - announced > 200) {
              setAge(Math.round(current.current.age));
              announced = now;
            }
          } else {
            elapsed = ((Math.min(current.current.age, 85) - 1) / 84) * 33;
            current.current.opacity = 1;
          }
          const a = Math.max(1, Math.min(85, current.current.age));
          model!.scale.setScalar(1 + 0.6 * (1 - Math.min(a / 25, 1)));
          model!.position.y = 0.12 * (1 - Math.min(a / 25, 1));
          let i = anchors.findIndex((v) => v >= a);
          if (i < 0) i = 6;
          const lo = Math.max(0, i - 1),
            blend =
              lo === i ? 1 : (a - anchors[lo]) / (anchors[i] - anchors[lo]);
          for (const target of skin) {
            target.weights.fill(0);
            const l = target.names[`age_${anchors[lo]}`],
              h = target.names[`age_${anchors[i]}`];
            if (l !== undefined) target.weights[l] = 1 - blend;
            if (h !== undefined) target.weights[h] = blend;
          }
          for (const mat of hair)
            mat.color.copy(dark).lerp(gray, Math.max(0, (a - 45) / 40));
          model!.visible = current.current.opacity > 0.08;
          renderer.domElement.style.opacity = String(current.current.opacity);
          if (!current.current.reduced || current.current.playing)
            mixer?.update(Math.min(dt, 0.06));
          controls.update();
          renderer.render(scene, camera);
        };
        frame = requestAnimationFrame(animate);
      } catch {
        if (!disposed) setStatus('failed');
        cleanup();
      }
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [visible, person, en, game]);
  function chooseAge(n: number) {
    current.current.age = n;
    current.current.playing = false;
    setAge(n);
    setPlaying(false);
  }
  return (
    <section
      ref={host}
      className={'age-scene ' + (game ? 'age-in-game' : '')}
      aria-label={t('年龄与时间', 'Age and time')}
    >
      <div className="age-viewport" ref={view} />
      {status !== 'ready' && (
        <div className="age-placeholder">
          <img
            src={`/models/character-${person}-poster.webp`}
            alt={t('人物静态预览', 'Character preview')}
            width={512}
            height={640}
          />
          <p role="status">
            {status === 'failed'
              ? t(
                  '三维暂不可用；游戏仍可继续。',
                  '3D is unavailable. You can still play.',
                )
              : t('正在准备三维人物…', 'Preparing your character…')}
          </p>
        </div>
      )}
      <div className="age-caption">
        <span>
          {t('年龄', 'Age')} <strong>{Math.round(age)}</strong>
        </span>
        <span>
          {t('拖动旋转 · 滚轮缩放', 'Drag to rotate · scroll to zoom')}
        </span>
      </div>
      <div className="age-controls">
        <button className="quiet" onClick={() => reset.current()}>
          {t('恢复视角', 'Reset view')}
        </button>
        {!game && (
          <>
            <button
              className="quiet"
              aria-pressed={playing}
              onClick={() => {
                current.current.playing = !playing;
                setPlaying(!playing);
              }}
            >
              {playing ? t('暂停', 'Pause') : t('播放成长', 'Play growth')}
            </button>
            <button
              className="quiet"
              onClick={() => setPerson((p) => (p === 0 ? 1 : 0))}
            >
              {t('切换人物', 'Switch character')}
            </button>
          </>
        )}
      </div>
      {!game && (
        <label className="age-slider">
          {t('查看一个年龄阶段', 'Explore an age')}
          <input
            type="range"
            aria-label={t('年龄', 'Age')}
            value={age}
            min={1}
            max={85}
            step={1}
            onChange={(e) => chooseAge(Number(e.target.value))}
          />
        </label>
      )}
      <p className="hint">
        {t(
          '人物是艺术化的年龄表达。键盘聚焦人物后，左右键旋转，＋／－缩放。',
          'An artistic expression of age. Focus the character, then use left/right arrows to rotate and +/− to zoom.',
        )}
      </p>
    </section>
  );
}
