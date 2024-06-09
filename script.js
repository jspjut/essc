document.addEventListener('DOMContentLoaded', function() {
    const deviceSelect = document.getElementById('device');
    const useCaseSelect = document.getElementById('use_case');
    const effectiveScreenSize = document.getElementById('effective_screen_size');
    const fontSize = document.getElementById('font_size');

    const devices = {
        ipad_air_11: { width: 2360, height: 1640 },
        ipad_pro_11: { width: 2420, height: 1668 },
        lenovo_duet_10: { width: 1920, height: 1080 }
    };

    const useCases = {
        single_page: 1.55,
        dual_page_portrait: 1.29,
        dual_page_landscape: 1.29
    };

    function calculate() {
        const device = devices[deviceSelect.value];
        const aspectRatio = useCases[useCaseSelect.value];

        let effectiveWidth, effectiveHeight;

        if (useCaseSelect.value === 'dual_page_landscape') {
            effectiveWidth = device.width;
            effectiveHeight = device.height / 2;
        } else {
            effectiveWidth = device.width / 2;
            effectiveHeight = device.height;
        }

        const effectiveScreenSizeValue = Math.sqrt(Math.pow(effectiveWidth, 2) + Math.pow(effectiveHeight, 2)) / 264;
        const fontSizeValue = (10 / 72) * 96 * (effectiveHeight / device.height);

        effectiveScreenSize.textContent = `Effective Screen Size: ${effectiveScreenSizeValue.toFixed(2)} inches`;
        fontSize.textContent = `10pt Font Size: ${fontSizeValue.toFixed(2)} pixels`;
    }

    deviceSelect.addEventListener('change', calculate);
    useCaseSelect.addEventListener('change', calculate);

    calculate();
});