document.addEventListener('DOMContentLoaded', function() {
    const devices = {
        ipad_air_11: { width: 2360, height: 1640 },
        ipad_pro_11: { width: 2420, height: 1668 },
        lenovo_duet_10: { width: 1920, height: 1080 }
    };

    const useCases = {
        single_page: 1.55,
        dual_page_portrait: 0.775,
        dual_page_landscape: 1.29
    };

    const deviceInputs = ['device1', 'device2', 'device3'];
    const useCaseInputs = ['use_case1', 'use_case2', 'use_case3'];

    deviceInputs.forEach(id => {
        document.getElementById(id + 'Input').addEventListener('keyup', function() {
            filterFunction(id, this.value);
        });
    });

    useCaseInputs.forEach(id => {
        document.getElementById(id + 'Input').addEventListener('keyup', function() {
            filterFunction(id, this.value);
        });
    });

    function filterFunction(id, value) {
        const filter = value.toUpperCase();
        const select = document.getElementById(id);
        const options = select.getElementsByTagName('option');
        for (let i = 0; i < options.length; i++) {
            const txtValue = options[i].textContent || options[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                options[i].style.display = "";
            } else {
                options[i].style.display = "none";
            }
        }
    }

    function calculate() {
        const device1 = devices[document.getElementById('device1').value];
        const device2 = devices[document.getElementById('device2').value];
        const device3 = devices[document.getElementById('device3').value];
        const useCase1 = useCases[document.getElementById('use_case1').value];
        const useCase2 = useCases[document.getElementById('use_case2').value];
        const useCase3 = useCases[document.getElementById('use_case3').value];

        const effectiveScreenSize1 = calculateEffectiveScreenSize(device1, useCase1);
        const effectiveScreenSize2 = calculateEffectiveScreenSize(device2, useCase2);
        const effectiveScreenSize3 = calculateEffectiveScreenSize(device3, useCase3);

        const fontSize1 = calculateFontSize(device1, useCase1);
        const fontSize2 = calculateFontSize(device2, useCase2);
        const fontSize3 = calculateFontSize(device3, useCase3);

        document.getElementById('effective_screen_size').textContent = `Effective Screen Size: ${effectiveScreenSize1.toFixed(2)}", ${effectiveScreenSize2.toFixed(2)}", ${effectiveScreenSize3.toFixed(2)}"`;
        document.getElementById('font_size').textContent = `10pt Font Size: ${fontSize1.toFixed(2)}px, ${fontSize2.toFixed(2)}px, ${fontSize3.toFixed(2)}px`;
    }

    function calculateEffectiveScreenSize(device, aspectRatio) {
        let effectiveWidth, effectiveHeight;
        if (aspectRatio === useCases.dual_page_landscape) {
            effectiveWidth = device.width;
            effectiveHeight = device.height / 2;
        } else {
            effectiveWidth = device.width / 2;
            effectiveHeight = device.height;
        }
        return Math.sqrt(Math.pow(effectiveWidth, 2) + Math.pow(effectiveHeight, 2)) / 264;
    }

    function calculateFontSize(device, aspectRatio) {
        let effectiveHeight;
        if (aspectRatio === useCases.dual_page_landscape) {
            effectiveHeight = device.height / 2;
        } else {
            effectiveHeight = device.height;
        }
        return (10 / 72) * 96 * (effectiveHeight / device.height);
    }

    deviceInputs.concat(useCaseInputs).forEach(id => {
        document.getElementById(id).addEventListener('change', calculate);
    });

    calculate();
});