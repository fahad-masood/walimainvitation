/** Native audio with a first-interaction fallback when browsers block autoplay. */
let playFromEntrance: (() => void) | undefined;

/** Called directly inside the entrance's trusted click, before animation begins. */
export function startInvitationMusic(): void {
  playFromEntrance?.();
}

const musicRoot = document.querySelector<HTMLElement>('[data-invitation-music]');
const entranceGate = document.querySelector<HTMLDetailsElement>('[data-invitation-entrance]');

if (musicRoot) {
  const audio = musicRoot.querySelector<HTMLAudioElement>('[data-music-audio]');
  const toggle = musicRoot.querySelector<HTMLButtonElement>('[data-music-toggle]');
  const label = musicRoot.querySelector<HTMLElement>('[data-music-label]');
  const playIcon = musicRoot.querySelector<SVGElement>('[data-music-play]');
  const pauseIcon = musicRoot.querySelector<SVGElement>('[data-music-pause]');
  const status = musicRoot.querySelector<HTMLElement>('[data-music-status]');

  if (audio && toggle && label && playIcon && pauseIcon && status) {
    const trackTitle = musicRoot.dataset.trackTitle ?? 'Invitation music';
    let manuallyPaused = false;
    let unavailable = false;
    let playRequested = false;
    let requestVersion = 0;
    let interactionFallbackArmed = false;
    let interactionFallbackRetired = false;
    let entrancePlaybackRequested = !entranceGate;
    audio.volume = 0.28;

    function removeInteractionFallback() {
      document.removeEventListener('click', playOnFirstInteraction, true);
      document.removeEventListener('keydown', playOnFirstInteraction, true);
      interactionFallbackArmed = false;
      interactionFallbackRetired = true;
    }

    function playOnFirstInteraction(event: Event) {
      if (!event.isTrusted || manuallyPaused || unavailable) return;
      if (event.target instanceof Node && musicRoot!.contains(event.target)) return;
      if (event instanceof KeyboardEvent && (
        event.repeat || event.altKey || event.ctrlKey || event.metaKey
        || ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock', 'ScrollLock', 'Escape', 'Unidentified', 'Dead', 'Process'].includes(event.key)
      )) return;
      removeInteractionFallback();
      void requestPlayback(true);
    }

    function armInteractionFallback() {
      if (entranceGate || interactionFallbackArmed || interactionFallbackRetired || manuallyPaused || unavailable) return;
      interactionFallbackArmed = true;
      document.addEventListener('click', playOnFirstInteraction, true);
      document.addEventListener('keydown', playOnFirstInteraction, true);
    }

    function showPlaybackState(playing: boolean) {
      if (unavailable) return;
      const action = playing ? 'Pause music' : 'Play music';
      label!.textContent = action;
      toggle!.setAttribute('aria-label', `${action}: ${trackTitle}`);
      toggle!.setAttribute('aria-pressed', String(playing));
      playIcon!.toggleAttribute('hidden', playing);
      pauseIcon!.toggleAttribute('hidden', !playing);
    }

    function showUnavailable() {
      if (unavailable) return;
      unavailable = true;
      removeInteractionFallback();
      requestVersion += 1;
      playRequested = false;
      audio!.pause();
      label!.textContent = 'Music unavailable';
      toggle!.setAttribute('aria-label', `${trackTitle}: music unavailable`);
      toggle!.setAttribute('aria-pressed', 'false');
      toggle!.disabled = true;
      playIcon!.removeAttribute('hidden');
      pauseIcon!.setAttribute('hidden', '');
      status!.textContent = 'The invitation music could not be loaded.';
    }

    async function requestPlayback(automatic = false) {
      if (unavailable || !entrancePlaybackRequested || (automatic && manuallyPaused)) return;
      playRequested = true;
      const currentRequest = ++requestVersion;
      try {
        await audio!.play();
        if (currentRequest !== requestVersion || manuallyPaused) return;
        playRequested = false;
        showPlaybackState(!audio!.paused);
      } catch (error) {
        if (currentRequest !== requestVersion || unavailable) return;
        playRequested = false;
        const errorName = error instanceof DOMException ? error.name : '';
        if (errorName === 'NotAllowedError' || errorName === 'AbortError') {
          showPlaybackState(false);
          if (errorName === 'NotAllowedError') armInteractionFallback();
          status!.textContent = errorName === 'NotAllowedError'
            ? (entranceGate
              ? `Select Play music to listen to ${trackTitle}.`
              : 'Music will start with your next tap or key press. The music control is also available.')
            : 'Music is paused.';
          return;
        }
        showUnavailable();
      }
    }

    audio.addEventListener('playing', () => {
      if (manuallyPaused || unavailable || !entrancePlaybackRequested) {
        audio.pause();
        return;
      }
      playRequested = false;
      removeInteractionFallback();
      showPlaybackState(true);
      status.textContent = `Playing ${trackTitle}.`;
    });
    audio.addEventListener('pause', () => {
      playRequested = false;
      showPlaybackState(false);
      if (!unavailable) status.textContent = 'Music is paused.';
    });
    audio.addEventListener('error', showUnavailable);

    toggle.addEventListener('click', () => {
      if (unavailable) return;
      if (!audio.paused || playRequested) {
        manuallyPaused = true;
        removeInteractionFallback();
        requestVersion += 1;
        playRequested = false;
        audio.pause();
        showPlaybackState(false);
      } else {
        manuallyPaused = false;
        entrancePlaybackRequested = true;
        void requestPlayback();
      }
    });

    playFromEntrance = () => {
      if (manuallyPaused || unavailable) return;
      entrancePlaybackRequested = true;
      removeInteractionFallback();
      void requestPlayback(true);
    };

    toggle.hidden = false;
    if (!entranceGate) {
      if (document.readyState === 'complete') {
        void requestPlayback(true);
      } else {
        window.addEventListener('load', () => void requestPlayback(true), { once: true });
      }
    }
  }
}
