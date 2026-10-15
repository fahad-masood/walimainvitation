import { startInvitationMusic } from './invitation-music';

const entrance = document.querySelector<HTMLDetailsElement>('[data-invitation-entrance]');
const opener = entrance?.querySelector<HTMLElement>('[data-entrance-open]');
const content = entrance?.querySelector<HTMLElement>('[data-invitation-content]');

if (entrance && opener && content) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let completionTimer: number | undefined;

  function requestedDestination(): HTMLElement | null {
    if (!window.location.hash) return null;
    try {
      const destination = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      return destination && content!.contains(destination) ? destination : null;
    } catch {
      return null;
    }
  }

  function finishOpening(focusContent = true) {
    if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    entrance!.open = true;
    entrance!.dataset.entranceState = 'open';
    content!.inert = false;
    document.documentElement.removeAttribute('data-invitation-locked');
    opener!.removeAttribute('aria-busy');

    if (!focusContent) return;
    const destination = requestedDestination();
    const focusTarget = destination
      ?? content!.querySelector<HTMLElement>('#couple-names')
      ?? content!;
    if (!focusTarget.hasAttribute('tabindex')) {
      focusTarget.setAttribute('tabindex', '-1');
      focusTarget.addEventListener('blur', () => focusTarget.removeAttribute('tabindex'), { once: true });
    }
    focusTarget.focus({ preventScroll: true });
    if (destination) {
      destination.scrollIntoView({ behavior: 'instant', block: 'start' });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }

  opener.addEventListener('click', (event) => {
    // The controller opens native details once, so repeated clicks cannot close it.
    event.preventDefault();
    if (entrance.dataset.entranceState !== 'closed') return;

    // Keep this call in the trusted activation stack, before timers or animations.
    if (event.isTrusted) startInvitationMusic();
    entrance.dataset.entranceState = 'opening';
    opener.setAttribute('aria-busy', 'true');
    entrance.open = true;

    if (reducedMotion.matches) {
      finishOpening();
    } else {
      completionTimer = window.setTimeout(() => finishOpening(), 1850);
    }
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && entrance.dataset.entranceState === 'opening') finishOpening();
  });

  entrance.addEventListener('toggle', () => {
    // Fragment navigation must wait for the same envelope activation as every guest.
    if (entrance.open && entrance.dataset.entranceState === 'closed') {
      entrance.open = false;
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  });

  if (entrance.open && !window.location.hash) {
    finishOpening(false);
  } else {
    entrance.open = false;
    entrance.dataset.entranceState = 'closed';
    content.inert = true;
    document.documentElement.setAttribute('data-invitation-locked', '');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
}
