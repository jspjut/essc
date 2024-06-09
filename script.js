document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const devices = data.devices;
            const useCases = data.useCases;

            const deviceInputs = ['device1', 'device2', 'device3'];
            const useCaseInputs = ['use_case1', 'use_case2', 'use_case3'];

            // Populate dropdowns with options
            deviceInputs.forEach((id, index) => {
                const select = document.getElementById(id);
                devices.forEach((device, deviceIndex) => {
                    const option = document.createElement('option');
                    option.value = device.id;
                    option.textContent = device.name;
                    if (index === deviceIndex) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            });

            useCaseInputs.forEach((id, index) => {
                const select = document.getElementById(id);
                useCases.forEach((useCase, useCaseIndex) => {
                    const option = document.createElement('option');
                    option.value = useCase.id;
                    option.textContent = useCase.name;
                    if (index === useCaseIndex) {
                        option.selected = true;
                    }
                    select.appendChild(option);
                });
            });

            function calculate() {
                const device1 = devices.find(device => device.id === document.getElementById('device1').value);
                const device2 = devices.find(device => device.id === document.getElementById('device2').value);
                const device3 = devices.find(device => device.id === document.getElementById('device3').value);
                const useCase1 = useCases.find(useCase => useCase.id === document.getElementById('use_case1').value);
                const useCase2 = useCases.find(useCase => useCase.id === document.getElementById('use_case2').value);
                const useCase3 = useCases.find(useCase => useCase.id === document.getElementById('use_case3').value);

                updateResult('result1', device1, useCase1);
                updateResult('result2', device2, useCase1);
                updateResult('result3', device3, useCase1);
                updateResult('result4', device1, useCase2);
                updateResult('result5', device2, useCase2);
                updateResult('result6', device3, useCase2);
                updateResult('result7', device1, useCase3);
                updateResult('result8', device2, useCase3);
                updateResult('result9', device3, useCase3);
            }

            function updateResult(resultId, device, useCase) {
                const effectiveScreenSize = calculateEffectiveScreenSize(device, useCase.aspectRatio, useCase.deviceOrientation);
                const fontSize = calculateFontSize(device, useCase.aspectRatio, useCase.deviceOrientation);
                const screenWaste = calculateScreenWaste(device, useCase.aspectRatio, useCase.deviceOrientation);
                const deviceAspectRatio = calculateDeviceAspectRatio(device, useCase.deviceOrientation);
                const contentAspectRatio = useCase.aspectRatio.toFixed(2);
                document.getElementById(resultId).innerHTML = `
                    Device Aspect Ratio: ${deviceAspectRatio}<br>
                    Content Aspect Ratio: ${contentAspectRatio}<br>
                    Effective Screen Size: ${effectiveScreenSize.toFixed(2)}"<br>
                    10pt Font Size: ${fontSize.pixels.toFixed(2)}px (${fontSize.physical.toFixed(2)} inches)<br>
                    Screen Waste: ${screenWaste.toFixed(2)}%
                `;
            }

            function calculateDeviceAspectRatio(device, deviceOrientation) {
                if (deviceOrientation === 'landscape') {
                    return (device.width / device.height).toFixed(2);
                } else {
                    return (device.height / device.width).toFixed(2);
                }
            }

            function calculateEffectiveScreenSize(device, aspectRatio, deviceOrientation) {
                let effectiveWidth, effectiveHeight;
                if (deviceOrientation === 'landscape') {
                    effectiveWidth = device.width;
                    effectiveHeight = device.width / aspectRatio;
                    if (effectiveHeight > device.height) {
                        effectiveHeight = device.height;
                        effectiveWidth = device.height * aspectRatio;
                    }
                } else {
                    effectiveHeight = device.height;
                    effectiveWidth = device.height * aspectRatio;
                    if (effectiveWidth > device.width) {
                        effectiveWidth = device.width;
                        effectiveHeight = device.width / aspectRatio;
                    }
                }
                const diagonalPixels = Math.sqrt(Math.pow(effectiveWidth, 2) + Math.pow(effectiveHeight, 2));
                const diagonalInches = device.diagonal;
                const pixelsPerInch = diagonalPixels / diagonalInches;
                return Math.sqrt(Math.pow(effectiveWidth, 2) + Math.pow(effectiveHeight, 2)) / pixelsPerInch;
            }

            function calculateFontSize(device, aspectRatio, deviceOrientation) {
                let effectiveHeight;
                if (deviceOrientation === 'landscape') {
                    effectiveHeight = device.width / aspectRatio;
                    if (effectiveHeight > device.height) {
                        effectiveHeight = device.height;
                    }
                } else {
                    effectiveHeight = device.height;
                    if (device.height * aspectRatio > device.width) {
                        effectiveHeight = device.width / aspectRatio;
                    }
                }
                const diagonalPixels = Math.sqrt(Math.pow(device.width, 2) + Math.pow(device.height, 2));
                const diagonalInches = device.diagonal;
                const pixelsPerInch = diagonalPixels / diagonalInches;
                const fontSizePixels = (10 / 72) * 96 * (effectiveHeight / device.height) * pixelsPerInch / 96;
                const fontSizeInches = (10 / 72) * (effectiveHeight / device.height) * (device.height / pixelsPerInch);
                return { pixels: fontSizePixels, physical: fontSizeInches };
            }

            function calculateScreenWaste(device, aspectRatio, deviceOrientation) {
                let effectiveWidth, effectiveHeight;
                if (deviceOrientation === 'landscape') {
                    effectiveWidth = device.width;
                    effectiveHeight = device.width / aspectRatio;
                    if (effectiveHeight > device.height) {
                        effectiveHeight = device.height;
                        effectiveWidth = device.height * aspectRatio;
                    }
                } else {
                    effectiveHeight = device.height;
                    effectiveWidth = device.height * aspectRatio;
                    if (effectiveWidth > device.width) {
                        effectiveWidth = device.width;
                        effectiveHeight = device.width / aspectRatio;
                    }
                }
                const totalArea = device.width * device.height;
                const usedArea = effectiveWidth * effectiveHeight;
                const wasteArea = totalArea - usedArea;
                return (wasteArea / totalArea) * 100;
            }

            deviceInputs.concat(useCaseInputs).forEach(id => {
                document.getElementById(id).addEventListener('change', calculate);
            });

            calculate();
        });
});
