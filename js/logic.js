document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const dataInput = document.getElementById('data-input');
    const algorithmSelect = document.getElementById('algorithm');
    const speedControl = document.getElementById('speed');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exampleBtn1 = document.getElementById('example1');
    const exampleBtn2 = document.getElementById('example2');
    const exampleBtn3 = document.getElementById('example3');
    const visualization = document.getElementById('visualization');
    const currentStep = document.getElementById('current-step');
    const comparisonsEl = document.getElementById('comparisons');
    const swapsEl = document.getElementById('swaps');
    const stepsEl = document.getElementById('steps');
    const timeEl = document.getElementById('time');
    const prevStepBtn = document.getElementById('prev-step');
    const nextStepBtn = document.getElementById('next-step');
    const currentStepNum = document.getElementById('current-step-num');
    const totalSteps = document.getElementById('total-steps');
    const algorithmInfo = document.getElementById('algorithm-info');

    const bubbleExplanation = document.getElementById('bubble-explanation');
    const insertionExplanation = document.getElementById('insertion-explanation');
    const selectionExplanation = document.getElementById('selection-explanation');
    
    // State variables
    let array = [];
    let animationSteps = [];
    let currentStepIndex = -1;
    let comparisons = 0;
    let swaps = 0;
    let steps = 0;
    let sortingStartTime = 0;
    let animationInterval;
    let isRunning = false;
    let maxValue = 0;
    
    // Example data sets
    exampleBtn1.addEventListener('click', () => {
        dataInput.value = "8, 5, 2, 6, 9";
    });
    
    exampleBtn2.addEventListener('click', () => {
        dataInput.value = "42, 23, 74, 11, 65, 58, 94, 36, 99, 87";
    });
    
    exampleBtn3.addEventListener('click', () => {
        dataInput.value = "10, 12, 15, 14, 16, 20, 23, 25, 24, 30";
    });
    
    // Algorithm change handler
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    
    // Update algorithm explanation
    function updateAlgorithmInfo() {
        const algorithm = algorithmSelect.value;
        
        // Update the highlighted algorithm explanation
        bubbleExplanation.classList.remove('algostep-highlight');
        insertionExplanation.classList.remove('algostep-highlight');
        selectionExplanation.classList.remove('algostep-highlight');
        
        if (algorithm === 'bubble') {
            bubbleExplanation.classList.add('algostep-highlight');
            algorithmInfo.innerHTML = `
                <h3 class="font-semibold text-gray-100 mb-2">Bubble Sort (Ordenamiento Burbuja)</h3>
                <p class="text-gray-300 text-sm">Compara elementos adyacentes e intercambia según su orden. Se repite hasta ordenar todos los elementos.</p>
            `;
        } else if (algorithm === 'insertion') {
            insertionExplanation.classList.add('algostep-highlight');
            algorithmInfo.innerHTML = `
                <h3 class="font-semibold text-gray-100 mb-2">Insertion Sort (Ordenamiento por Inserción)</h3>
                <p class="text-gray-300 text-sm">Construye un arreglo ordenado uno a uno, tomando cada elemento e insertándolo en su posición correcta.</p>
            `;
        } else if (algorithm === 'selection') {
            selectionExplanation.classList.add('algostep-highlight');
            algorithmInfo.innerHTML = `
                <h3 class="font-semibold text-gray-100 mb-2">Selection Sort (Ordenamiento por Selección)</h3>
                <p class="text-gray-300 text-sm">Busca el elemento mínimo en cada iteración y lo coloca en su posición correcta.</p>
            `;
        }
    }
    
    // Initialize with default algorithm info
    updateAlgorithmInfo();
    
    // Create bars from array
    function createBars() {
        visualization.innerHTML = '';
        maxValue = Math.max(...array);
        
        const containerWidth = visualization.clientWidth;
        const barWidth = (containerWidth / array.length) - 4;
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            const height = (value / maxValue) * 100;
            
            bar.className = 'bar absolute bottom-0 bg-teal-500 rounded-t';
            bar.style.left = `${index * (barWidth + 4)}px`;
            bar.style.width = `${barWidth}px`;
            bar.style.height = `${height}%`;
            
            const label = document.createElement('div');
            label.className = 'text-xs text-center absolute w-full -top-5';
            label.textContent = value;
            
            bar.appendChild(label);
            visualization.appendChild(bar);
        });
    }
    
    // Parse input data
    function parseInputData() {
        const input = dataInput.value;
        array = input.split(',')
            .map(item => parseInt(item.trim()))
            .filter(num => !isNaN(num));
        
        return array.length > 0;
    }
    
    // Reset the visualization
    function resetVisualization() {
        clearInterval(animationInterval);
        isRunning = false;
        pauseBtn.disabled = true;
        startBtn.disabled = false;
        currentStepIndex = -1;
        comparisons = 0;
        swaps = 0;
        steps = 0;
        sortingStartTime = 0;
        
        comparisonsEl.textContent = comparisons;
        swapsEl.textContent = swaps;
        stepsEl.textContent = steps;
        timeEl.textContent = '0.0s';
        currentStepNum.textContent = 0;
        totalSteps.textContent = 0;
        prevStepBtn.disabled = true;
        nextStepBtn.disabled = true;
        
        currentStep.textContent = 'Selecciona datos y presiona "Iniciar" para comenzar la visualización.';
        
        if (parseInputData()) {
            createBars();
        } else {
            visualization.innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">Ingresa datos válidos para comenzar</div>';
        }
    }
    
    // Reset button handler
    resetBtn.addEventListener('click', resetVisualization);
    
    // Initialize visualization
    resetVisualization();
    
    // Generate Bubble Sort animation steps
    function generateBubbleSortSteps(arr) {
        const steps = [];
        const arrCopy = [...arr];
        let localComparisons = 0;
        let localSwaps = 0;

        steps.push({
            array: [...arrCopy],
            description: "Comenzamos con el arreglo desordenado.",
            comparisons: localComparisons,
            swaps: localSwaps,
            comparing: [],
            swapping: []
        });

        let n = arrCopy.length;
        let swapped;

        for (let i = 0; i < n - 1; i++) {
            swapped = false;

            for (let j = 0; j < n - i - 1; j++) {
                // Comparing step
                steps.push({
                    array: [...arrCopy],
                    description: `Comparando ${arrCopy[j]} y ${arrCopy[j + 1]}`,
                    comparisons: ++localComparisons,
                    swaps: localSwaps,
                    comparing: [j, j + 1],
                    swapping: []
                });

                if (arrCopy[j] > arrCopy[j + 1]) {
                    // Swapping step
                    [arrCopy[j], arrCopy[j + 1]] = [arrCopy[j + 1], arrCopy[j]];
                    swapped = true;

                    steps.push({
                        array: [...arrCopy],
                        description: `${arrCopy[j + 1]} > ${arrCopy[j]}, por lo tanto intercambiamos`,
                        comparisons: localComparisons,
                        swaps: ++localSwaps,
                        comparing: [],
                        swapping: [j, j + 1]
                    });
                } else {
                    steps.push({
                        array: [...arrCopy],
                        description: `${arrCopy[j]} <= ${arrCopy[j + 1]}, no necesitamos intercambiar`,
                        comparisons: localComparisons,
                        swaps: localSwaps,
                        comparing: [],
                        swapping: []
                    });
                }
            }

            // End of pass
            if (swapped) {
                steps.push({
                    array: [...arrCopy],
                    description: `Terminamos una pasada pero hubo intercambios, continuamos con otra pasada.`,
                    comparisons: localComparisons,
                    swaps: localSwaps,
                    comparing: [],
                    swapping: []
                });
            } else {
                steps.push({
                    array: [...arrCopy],
                    description: "¡No hubo intercambios en esta pasada! El arreglo está ordenado.",
                    comparisons: localComparisons,
                    swaps: localSwaps,
                    comparing: [],
                    swapping: [],
                    done: true
                });
                break;
            }
        }

        return steps;
    }
    
    // Generate Insertion Sort animation steps
    function generateInsertionSortSteps(arr) {
        const steps = [];
        const arrCopy = [...arr];
        let localComparisons = 0;
        let localSwaps = 0;
        
        steps.push({
            array: [...arrCopy],
            description: "Comenzamos con el arreglo desordenado.",
            comparisons: localComparisons,
            swaps: localSwaps,
            comparing: [],
            swapping: [],
            sorted: [0]
        });
        
        for (let i = 1; i < arrCopy.length; i++) {
            const key = arrCopy[i];
            
            steps.push({
                array: [...arrCopy],
                description: `Tomamos el elemento ${key} para insertarlo en su posición correcta.`,
                comparisons: localComparisons,
                swaps: localSwaps,
                comparing: [i],
                swapping: [],
                sorted: Array.from({length: i}, (_, idx) => idx)
            });
            
            let j = i - 1;
            
            while (j >= 0) {
                steps.push({
                    array: [...arrCopy],
                    description: `Comparando ${key} con ${arrCopy[j]}`,
                    comparisons: ++localComparisons,
                    swaps: localSwaps,
                    comparing: [j, i],
                    swapping: [],
                    sorted: Array.from({length: i}, (_, idx) => idx)
                });
                
                if (arrCopy[j] > key) {
                    arrCopy[j + 1] = arrCopy[j];
                    
                    steps.push({
                        array: [...arrCopy],
                        description: `${arrCopy[j]} > ${key}, movemos ${arrCopy[j]} a la derecha`,
                        comparisons: localComparisons,
                        swaps: ++localSwaps,
                        comparing: [],
                        swapping: [j, j+1],
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    
                    j--;
                } else {
                    steps.push({
                        array: [...arrCopy],
                        description: `${arrCopy[j]} <= ${key}, no necesitamos mover más elementos`,
                        comparisons: localComparisons,
                        swaps: localSwaps,
                        comparing: [],
                        swapping: [],
                        sorted: Array.from({length: i}, (_, idx) => idx)
                    });
                    
                    break;
                }
            }
            
            arrCopy[j + 1] = key;
            
            steps.push({
                array: [...arrCopy],
                description: `Insertamos ${key} en su posición correcta`,
                comparisons: localComparisons,
                swaps: localSwaps,
                comparing: [],
                swapping: [j+1],
                sorted: Array.from({length: i+1}, (_, idx) => idx)
            });
        }
        
        steps.push({
            array: [...arrCopy],
            description: "¡Inserción completada! El arreglo está ordenado.",
            comparisons: localComparisons,
            swaps: localSwaps,
            comparing: [],
            swapping: [],
            sorted: Array.from({length: arrCopy.length}, (_, idx) => idx),
            done: true
        });
        
        return steps;
    }
    
    // Generate Selection Sort animation steps
    function generateSelectionSortSteps(arr) {
        const steps = [];
        const arrCopy = [...arr];
        let localComparisons = 0;
        let localSwaps = 0;
        
        steps.push({
            array: [...arrCopy],
            description: "Comenzamos con el arreglo desordenado.",
            comparisons: localComparisons,
            swaps: localSwaps,
            comparing: [],
            swapping: [],
            sorted: []
        });
        
        for (let i = 0; i < arrCopy.length - 1; i++) {
            let minIndex = i;
            
            steps.push({
                array: [...arrCopy],
                description: `Buscando el elemento mínimo en la parte no ordenada empezando por ${arrCopy[i]}`,
                comparisons: localComparisons,
                swaps: localSwaps,
                comparing: [i],
                swapping: [],
                sorted: Array.from({length: i}, (_, idx) => idx),
                minIndex: minIndex
            });
            
            for (let j = i + 1; j < arrCopy.length; j++) {
                steps.push({
                    array: [...arrCopy],
                    description: `Comparando el mínimo actual ${arrCopy[minIndex]} con ${arrCopy[j]}`,
                    comparisons: ++localComparisons,
                    swaps: localSwaps,
                    comparing: [minIndex, j],
                    swapping: [],
                    sorted: Array.from({length: i}, (_, idx) => idx),
                    minIndex: minIndex
                });
                
                if (arrCopy[j] < arrCopy[minIndex]) {
                    minIndex = j;
                    
                    steps.push({
                        array: [...arrCopy],
                        description: `Encontramos un nuevo mínimo: ${arrCopy[minIndex]}`,
                        comparisons: localComparisons,
                        swaps: localSwaps,
                        comparing: [],
                        swapping: [],
                        sorted: Array.from({length: i}, (_, idx) => idx),
                        minIndex: minIndex
                    });
                }
            }
            
            if (minIndex !== i) {
                [arrCopy[i], arrCopy[minIndex]] = [arrCopy[minIndex], arrCopy[i]];
                
                steps.push({
                    array: [...arrCopy],
                    description: `Intercambiamos el mínimo ${arrCopy[i]} con el elemento en la posición ${i+1}`,
                    comparisons: localComparisons,
                    swaps: ++localSwaps,
                    comparing: [],
                    swapping: [i, minIndex],
                    sorted: Array.from({length: i}, (_, idx) => idx)
                });
            } else {
                steps.push({
                    array: [...arrCopy],
                    description: `El elemento ${arrCopy[i]} ya está en su posición correcta`,
                    comparisons: localComparisons,
                    swaps: localSwaps,
                    comparing: [],
                    swapping: [],
                    sorted: Array.from({length: i}, (_, idx) => idx)
                });
            }
            
            steps.push({
                array: [...arrCopy],
                description: `El elemento ${arrCopy[i]} está ahora en su posición final`,
                comparisons: localComparisons,
                swaps: localSwaps,
                comparing: [],
                swapping: [],
                sorted: Array.from({length: i+1}, (_, idx) => idx)
            });
        }
        
        steps.push({
            array: [...arrCopy],
            description: "¡Selección completada! El arreglo está ordenado.",
            comparisons: localComparisons,
            swaps: localSwaps,
            comparing: [],
            swapping: [],
            sorted: Array.from({length: arrCopy.length}, (_, idx) => idx),
            done: true
        });
        
        return steps;
    }
    
    // Start or resume the animation
    function startAnimation() {
        if (isRunning) return;
        
        if (currentStepIndex === -1) {
            if (!parseInputData()) {
                alert("Por favor, ingresa datos válidos.");
                return;
            }
            createBars();
            // Generate steps based on the selected algorithm
            const algorithm = algorithmSelect.value;
            if (algorithm === 'bubble') {
                animationSteps = generateBubbleSortSteps(array);
            } else if (algorithm === 'insertion') {
                animationSteps = generateInsertionSortSteps(array);
            } else if (algorithm === 'selection') {
                animationSteps = generateSelectionSortSteps(array);
            }
            
            sortingStartTime = Date.now();
            totalSteps.textContent = animationSteps.length;
        }
        
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        prevStepBtn.disabled = true;
        nextStepBtn.disabled = true;
        
        // Calculate delay based on speed control
        const delay = 1100 - (speedControl.value * 100);
        
        // Start the animation interval
        animationInterval = setInterval(() => {
            nextStep();
            
            if (currentStepIndex >= animationSteps.length - 1) {
                clearInterval(animationInterval);
                isRunning = false;
                pauseBtn.disabled = true;
                prevStepBtn.disabled = false;
                nextStepBtn.disabled = true;
            }
        }, delay);
    }
    
    // Pause the animation
    function pauseAnimation() {
        clearInterval(animationInterval);
        isRunning = false;
        pauseBtn.disabled = true;
        startBtn.disabled = false;
        prevStepBtn.disabled = currentStepIndex <= 0;
        nextStepBtn.disabled = currentStepIndex >= animationSteps.length - 1;
    }
    
    // Go to next step
    function nextStep() {
        if (currentStepIndex < animationSteps.length - 1) {
            currentStepIndex++;
            renderStep(currentStepIndex);
        }
    }
    
    // Go to previous step
    function prevStep() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderStep(currentStepIndex);
        }
    }
    
    // Render the current step
    function renderStep(index) {
        const step = animationSteps[index];
        
        // Update bars
        const bars = visualization.querySelectorAll('.bar');
        
        // Remove all highlighting classes
        bars.forEach(bar => {
            bar.classList.remove('bg-red-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-yellow-500');
            bar.classList.add('bg-teal-500');
        });
        
        // Apply current step data
        step.array.forEach((value, i) => {
            const bar = bars[i];
            if (bar) {
                const height = (value / maxValue) * 100;
                bar.style.height = `${height}%`;
                bar.querySelector('div').textContent = value;
                
                // Special styling for bars being compared
                if (step.comparing && step.comparing.includes(i)) {
                    bar.classList.remove('bg-teal-500');
                    bar.classList.add('bg-yellow-500');
                }
                
                // Special styling for bars being swapped
                if (step.swapping && step.swapping.includes(i)) {
                    bar.classList.remove('bg-teal-500', 'bg-yellow-500');
                    bar.classList.add('bg-red-500');
                }
                
                // Special styling for the current minimum (only for selection sort)
                if (step.minIndex === i) {
                    bar.classList.remove('bg-teal-500');
                    bar.classList.add('bg-blue-500');
                }
                
                // Special styling for sorted elements
                if (step.sorted && step.sorted.includes(i)) {
                    if (!step.comparing || !step.comparing.includes(i)) {
                        if (!step.swapping || !step.swapping.includes(i)) {
                            if (step.minIndex !== i) {
                                bar.classList.remove('bg-teal-500');
                                bar.classList.add('bg-green-500');
                            }
                        }
                    }
                }
            }
        });
        
        // Update info displays
        comparisons = step.comparisons;
        swaps = step.swaps;
        steps = index;
        
        comparisonsEl.textContent = comparisons;
        swapsEl.textContent = swaps;
        stepsEl.textContent = steps;
        
        const elapsedTime = (Date.now() - sortingStartTime) / 1000;
        timeEl.textContent = elapsedTime.toFixed(1) + 's';
        
        currentStep.textContent = step.description;
        currentStepNum.textContent = index + 1;
        
        // Handle nav buttons when in manual mode
        if (!isRunning) {
            prevStepBtn.disabled = index <= 0;
            nextStepBtn.disabled = index >= animationSteps.length - 1;
        }
        
        // If this is the last step, mark sorting as complete
        if (step.done) {
            currentStep.innerHTML = `<span class="text-green-400 font-medium">¡Ordenamiento completado!</span> ${step.description}`;
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startAnimation);
    pauseBtn.addEventListener('click', pauseAnimation);
    prevStepBtn.addEventListener('click', prevStep);
    nextStepBtn.addEventListener('click', nextStep);
    
    // Handle window resize to redraw bars
    window.addEventListener('resize', () => {
        if (array.length > 0) {
            createBars();
        }
    });
});