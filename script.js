let canvas = document.getElementsByClassName('canvas')[0];
let ctx = canvas.getContext('2d');
let drawHistory = [];
let undoHistory = [];
let undoTest = [];
let redoTest = [];

let drawing = false;
let lastX = 0;
let lastY = 0;

function startDrawing(e) {
    drawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY]

    ctx.beginPath();
    ctx.moveTo(lastX, lastY)
}

function draw(e) {
    if (!drawing)
        return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY)
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
    if (drawing) {
        drawing = false;
        saveCanvasState();
    }
}

function saveCanvasState() {
    drawHistory.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
}

function undo() {
    if (drawHistory.length <= 1) return;
    undoHistory.push(drawHistory.pop());

    ctx.putImageData(drawHistory[drawHistory.length - 1], 0, 0)
}
function redo() {
    if (undoHistory.length === 0) return;
    const redoState = undoHistory.pop();
    drawHistory.push(redoState);

    ctx.putImageData(redoState, 0, 0)

}

function eraser() {
    ctx.strokeStyle = 'white';
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        undo();
    }
});
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
    }
});


function addListeners() {
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('mousemove', draw)
    canvas.addEventListener('mouseup', stopDrawing)
    canvas.addEventListener('touchend', stopDrawing)
    canvas.addEventListener('mouseout', stopDrawing)
}

function removeListeners() {
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.removeEventListener('mousemove', draw)
    canvas.removeEventListener('mouseup', stopDrawing)
    canvas.addEventListener('touchend', stopDrawing)
    canvas.removeEventListener('mouseout', stopDrawing)
}

addListeners();

function handleResize() {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();

    const scale = window.devicePixelRatio || 1;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    ctx.scale(scale, scale);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.lineCap = 'square';
}

handleResize();

let flag = 0;
let prevColor = 'black';

window.addEventListener('resize',()=> {
    window.location.reload();
})

function displayNone() {
    document.getElementsByClassName('eraser-dropdown')[0].style.display = 'none'
    document.getElementsByClassName('pallete-dropdown')[0].style.display = 'none';
    document.getElementsByClassName('linewidth-dropdown')[0].style.display = 'none';
}

// side-menu

document.getElementsByClassName('bar-sym')[0].addEventListener('click', () => {
    if (document.getElementsByClassName('fa-bars')[0].style.display === 'none') {
        document.getElementsByClassName('fa-bars')[0].style.display = 'block'
        document.getElementsByClassName('fa-times')[0].style.display = 'none';
        document.getElementsByClassName('side-menu')[0].style.display = 'none';
        document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
        document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
        canvas.style.width = '100vw'
        displayNone();
        return;
    }
    //open
    canvas.style.width = 'calc(100vw - 100px)'

    document.getElementsByClassName('bar-sym')[0].style.background = 'white'
    document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
    document.getElementsByClassName('fa-bars')[0].style.display = 'none'
    document.getElementsByClassName('fa-times')[0].style.display = 'block';
    document.getElementsByClassName('side-menu')[0].style.display = 'flex';
})

Array.from(document.querySelectorAll('.fa-ban')).forEach((e) => {
    e.addEventListener('click', () => {
        if (canvas.style.cursor === 'not-allowed') {
            canvas.style.cursor = 'auto'
            addListeners();
            document.getElementsByClassName('fa-bars')[0].style.display = 'block'
            document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
            document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
            document.getElementsByClassName('fa-times')[0].style.display = 'none';
            document.getElementsByClassName('side-menu')[0].style.display = 'none';
            canvas.style.width = '100vw'
            return;
        }
        displayNone();
        document.getElementsByClassName('fa-bars')[0].style.display = 'block'
        document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
        document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
        document.getElementsByClassName('fa-times')[0].style.display = 'none';
        document.getElementsByClassName('side-menu')[0].style.display = 'none';
        canvas.style.width = '100vw'
        removeListeners();
        canvas.style.cursor = 'not-allowed'
    })
})

Array.from(document.querySelectorAll('.pallete')).forEach((e) => {
    e.addEventListener('click', (event) => {
        if (document.getElementsByClassName('pallete-dropdown')[0].style.display === 'none') {
            displayNone();
            document.getElementsByClassName('pallete-dropdown')[0].style.display = 'flex';
            return;
        }
        document.getElementsByClassName('pallete-dropdown')[0].style.display = 'none';
        event.stopPropagation();
    })
})

Array.from(document.querySelectorAll('.pallete-colors')).forEach((Element) => {
    Element.addEventListener('click', (event) => {
        canvas.style.cursor = 'auto';
        addListeners();
        document.getElementsByClassName('fa-bars')[0].style.display = 'block'
        document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
        document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
        document.getElementsByClassName('fa-times')[0].style.display = 'none'
        document.getElementsByClassName('side-menu')[0].style.display = 'none';
        canvas.style.width = '100vw'
        ctx.strokeStyle = Element.dataset.color;
        displayNone();
        event.stopPropagation();
        prevColor = ctx.strokeStyle;
    })
})

Array.from(document.querySelectorAll('.pencil')).forEach((e) => {
    e.addEventListener('click', (event) => {
        addListeners();
        if (document.getElementsByClassName('linewidth-dropdown')[0].style.display === 'none') {
            document.getElementsByClassName('linewidth-dropdown')[0].style.display = 'flex';
            if (flag) {
                ctx.strokeStyle = prevColor;
                flag = 0;
            }
            return;
        }
        displayNone();
        if (flag) {
            ctx.strokeStyle = prevColor;
            flag = 0;
        }
        document.getElementsByClassName('linewidth-dropdown')[0].style.display = 'none';
        event.stopPropagation();
    })
})

Array.from(document.querySelectorAll('.pencil-size')).forEach((Element) => {
    Element.addEventListener('click', (event) => {
        canvas.style.cursor = 'auto';
        document.getElementsByClassName('fa-bars')[0].style.display = 'block'
        document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
        document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
        document.getElementsByClassName('fa-times')[0].style.display = 'none'
        document.getElementsByClassName('side-menu')[0].style.display = 'none';
        canvas.style.width = '100vw'
        ctx.lineWidth = Number(Element.dataset.pencil);
        displayNone();
        event.stopPropagation();
    })
})

Array.from(document.querySelectorAll('.eraser-sym')).forEach((e) => {
    e.addEventListener('click', (event) => {
        canvas.style.cursor = 'auto';
        if (document.getElementsByClassName('eraser-dropdown')[0].style.display === 'none') {
            displayNone();
            document.getElementsByClassName('eraser-dropdown')[0].style.display = 'flex';
            return;
        }
        document.getElementsByClassName('eraser-dropdown')[0].style.display = 'none';
        event.stopPropagation();
    })
})

Array.from(document.querySelectorAll('.eraser-size')).forEach((Element) => {
    Element.addEventListener('click', (event) => {
        canvas.style.cursor = 'auto';
        addListeners();
        document.getElementsByClassName('fa-bars')[0].style.display = 'block'
        document.getElementsByClassName('bar-sym')[0].style.background = '#F5E9EB'
        document.getElementsByClassName('bar-sym')[0].style.borderRadius = '100%'
        document.getElementsByClassName('fa-times')[0].style.display = 'none'
        document.getElementsByClassName('side-menu')[0].style.display = 'none';
        canvas.style.width = '100vw'
        ctx.lineWidth = Element.dataset.size;
        ctx.strokeStyle = 'white';
        flag = 1;
        displayNone();
        event.stopPropagation();
    })
})

Array.from(document.querySelectorAll('.undo')).forEach((Element) => {
    Element.addEventListener('click', (event) => {
        undo();
    })
})
Array.from(document.querySelectorAll('.redo')).forEach((Element) => {
    Element.addEventListener('click', (event) => {
        redo();
    })
})