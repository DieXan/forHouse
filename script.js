document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const canvasTitle = document.getElementById('canvas-title');
    const canvasWidthInput = document.getElementById('canvas-width');
    const canvasHeightInput = document.getElementById('canvas-height');
    const applyCanvasSettingsButton = document.getElementById('apply-canvas-settings');
    const addElementForm = document.getElementById('add-element-form');
    const newElementNameInput = document.getElementById('new-element-name');
    const newElementWidthInput = document.getElementById('new-element-width');
    const newElementHeightInput = document.getElementById('new-element-height');

    let draggedElement = null;

    document.querySelectorAll('.draggable').forEach(item => {
        item.addEventListener('dragstart', dragStart);
        item.addEventListener('dragend', dragEnd);
    });

    canvas.addEventListener('dragover', dragOver);
    canvas.addEventListener('drop', drop);

    applyCanvasSettingsButton.addEventListener('click', applyCanvasSettings);
    addElementForm.addEventListener('submit', addNewElement);

    function dragStart(e) {
        draggedElement = this;
        e.dataTransfer.setData('text/plain', null);
    }

    function dragEnd() {
        draggedElement = null;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();

        if (!draggedElement) return;

        const nameInput = draggedElement.querySelector('.element-name');
        const widthInput = draggedElement.querySelector('.element-width');
        const heightInput = draggedElement.querySelector('.element-height');

        const name = nameInput.value;
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        const newElement = document.createElement('div');
        newElement.className = `draggable room ${draggedElement.dataset.type}`;
        newElement.style.width = `${width}px`;
        newElement.style.height = `${height}px`;
        newElement.style.left = `${e.clientX - canvas.offsetLeft - width / 2}px`;
        newElement.style.top = `${e.clientY - canvas.offsetTop - height / 2}px`;
        newElement.style.position = 'absolute';
        newElement.textContent = name;

        const roomInfo = document.createElement('div');
        roomInfo.className = 'room-info';
        roomInfo.textContent = `Размер: ${width}x${height}px, Площадь: ${(width * height)} м²`;

        newElement.appendChild(roomInfo);

        newElement.addEventListener('mousedown', startDrag);
        newElement.addEventListener('mouseup', endDrag);
        newElement.addEventListener('mousemove', drag);

        canvas.appendChild(newElement);
    }

    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - this.offsetLeft;
        offsetY = e.clientY - this.offsetTop;
    }

    function endDrag() {
        isDragging = false;
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();
        this.style.left = `${e.clientX - offsetX}px`;
        this.style.top = `${e.clientY - offsetY}px`;
    }

    function applyCanvasSettings() {
        const width = parseInt(canvasWidthInput.value);
        const height = parseInt(canvasHeightInput.value);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
    }

    function addNewElement(e) {
        e.preventDefault();

        const name = newElementNameInput.value;
        const width = parseInt(newElementWidthInput.value);
        const height = parseInt(newElementHeightInput.value);

        if (!name || isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            alert('Пожалуйста, заполните все поля корректно.');
            return;
        }

        const newDraggable = document.createElement('div');
        newDraggable.className = 'draggable';
        newDraggable.draggable = true;
        newDraggable.dataset.type = 'custom';
        newDraggable.dataset.width = width;
        newDraggable.dataset.height = height;

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'element-name';
        nameInput.value = name;

        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.className = 'element-width';
        widthInput.value = width;

        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.className = 'element-height';
        heightInput.value = height;

        newDraggable.appendChild(nameInput);
        newDraggable.appendChild(widthInput);
        newDraggable.appendChild(heightInput);

        newDraggable.addEventListener('dragstart', dragStart);
        newDraggable.addEventListener('dragend', dragEnd);

        document.querySelector('.sidebar').appendChild(newDraggable);

        // Очистка формы
        newElementNameInput.value = '';
        newElementWidthInput.value = '';
        newElementHeightInput.value = '';
    }
});