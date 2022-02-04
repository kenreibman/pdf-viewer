// Set a variable of url. wherever the pdf is
const url = '../docs/KEN_REIBMAN_CV.pdf';

// Global variables that are reassigned
let pdfDoc = null,
    pageNum = 1, // Start on first page
    pageIsRendering = false, // When we run renderPage method, it gets set to true. When PDF is fetched it goes back to false. (state of page render)
    pageNumIsPending = null;

const scale = 1.5, // size
    canvas = document.querySelector('#pdf-render'),
    ctx = canvas.getContext('2d');

// Render the page
const renderPage = num => {
    pageIsRending = true;

    // Get page
    pdfDoc.getPage(num).then(page => {
        // Set scale
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderCtx = {
            canvasContext: ctx,
            viewport 
        }

        page.render(renderCtx).promise.then(() => {
            pageIsRendering = false;

            if(pageNumIsPending !== null) {
                renderPage(pageNumIsPending);
                pageIsRendering = null;
            }
        });

        // Output current page
        document.querySelector('#page-num').textContent = num;
    });
};

// Check for pages rendering
const queueRenderPage = num => {
    if(pageIsRendering) {
        pageNumIsPending = num;
    } else {
        renderPage(num);
    }
}

// Show previous page
const showPrevPage = () => {
    if(pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

// Show next page
const showNextPage = () => {
    if(pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

// Get Document
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    console.log(pdfDoc);

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum)
})
// Adding an error catch
    .catch(err => {
        //Display Error
        const div = document.createElement('div');
        div.className = 'error';
        div.appendChild(document.createTextNode(err.message)); // add text
        document.querySelector('body').insertBefore(div, canvas); // parent
        // Remove top bar
        document.querySelector('.top-bar').style.display = 'none'; // Grab top bar to display none.
    });


// Call button events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage);