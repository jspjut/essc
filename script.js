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
                const nativeScreenSize = device.diagonal;
            
                const resultContainer = document.getElementById(resultId);
                resultContainer.innerHTML = ''; // Clear previous content
            
                const table = document.createElement('table');
                table.style.borderCollapse = 'collapse';
            
                const row1 = table.insertRow();
                const cell1_1 = row1.insertCell();
                cell1_1.innerHTML = 'Device Aspect Ratio:';
                const cell1_2 = row1.insertCell();
                cell1_2.innerHTML = deviceAspectRatio;
            
                const row2 = table.insertRow();
                const cell2_1 = row2.insertCell();
                cell2_1.innerHTML = 'Content Aspect Ratio:';
                const cell2_2 = row2.insertCell();
                cell2_2.innerHTML = contentAspectRatio;
            
                const row6 = table.insertRow();
                const cell6_1 = row6.insertCell();
                cell6_1.innerHTML = 'Native Screen Size:';
                const cell6_2 = row6.insertCell();
                cell6_2.innerHTML = `${nativeScreenSize.toFixed(2)}"`;
            
                const row3 = table.insertRow();
                const cell3_1 = row3.insertCell();
                cell3_1.innerHTML = 'Effective Screen Size:';
                const cell3_2 = row3.insertCell();
                cell3_2.innerHTML = `${effectiveScreenSize.toFixed(2)}"`;
            
                const row5 = table.insertRow();
                const cell5_1 = row5.insertCell();
                cell5_1.innerHTML = 'Screen Waste:';
                const cell5_2 = row5.insertCell();
                cell5_2.innerHTML = `${screenWaste.toFixed(2)}%`;
            
                const row4 = table.insertRow();
                const cell4_1 = row4.insertCell();
                cell4_1.innerHTML = '10pt Font Size:';
                const cell4_2 = row4.insertCell();
                cell4_2.innerHTML = `${fontSize.pixels.toFixed(2)}px <br />${fontSize.physical.toFixed(2)}"`;
            
                resultContainer.appendChild(table);
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
                if (deviceOrientation === 'portrait') {
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
                if (deviceOrientation === 'portrait') {
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
