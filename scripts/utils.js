document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Logic ---
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeCheckbox = document.getElementById('themeToggleCheckbox');

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeCheckbox) themeCheckbox.checked = true;
    }

    if (themeCheckbox) {
        themeCheckbox.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // --- Shared Utilities Initialization ---
    document.querySelectorAll('input[type="range"]').forEach(attachSliderWheelEvent);

    const autoExpandTextareas = document.querySelectorAll('.auto-expand');
    autoExpandTextareas.forEach(textarea => {
        textarea.addEventListener('input', autoResizeTextarea);
        autoResizeTextarea({ target: textarea });
    });

}); // End DOMContentLoaded

// --- Global Utilities ---
function autoResizeTextarea(e) {
    const textarea = e.target;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function attachSliderWheelEvent(slider) {
    const container = slider.parentElement;
    if (container) {
        container.classList.add('slider-interaction-area');
        container.addEventListener('wheel', (e) => {
            if (slider.disabled) return;
            e.preventDefault();
            const delta = Math.sign(e.deltaY) * -1;
            const currentVal = parseInt(slider.value);
            const min = parseInt(slider.min) || 0;
            const max = parseInt(slider.max) || 10;
            const step = parseInt(slider.step) || 1;
            let newVal = currentVal + (delta * step);
            if (newVal > max) newVal = max;
            if (newVal < min) newVal = min;
            if (newVal !== currentVal) {
                slider.value = newVal;
                slider.dispatchEvent(new Event('input'));
            }
        }, { passive: false });
    }
}

function copyToClipboard(element, button) {
    const textToCopy = element.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('primary');
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('primary');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Không thể copy. Vui lòng chọn và copy thủ công.');
    });
}
