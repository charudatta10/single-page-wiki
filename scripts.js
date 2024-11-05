document.addEventListener("DOMContentLoaded", function() {
    // Element References
    const newPageTitle = document.getElementById('newPageTitle');
    const newPageContent = document.getElementById('newPageContent');
    const editPageContent = document.getElementById('editPageContent');
    const pageList = document.getElementById('pageList');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const settingsModal = document.getElementById('settingsModal');
    const customCssTextarea = document.getElementById('custom-css');
    const customJsTextarea = document.getElementById('custom-js');
    const fabMenu = document.getElementById('fabMenu');

    let pages = JSON.parse(localStorage.getItem('pages')) || [];
    let selectedPage = null;
    let itemsPerPage = 5;
    let currentPage = 1;
    let fabMenuVisible = false;
    let settingsModalVisible = false;
    let customCss = localStorage.getItem('customCss') || '';
    let customJs = localStorage.getItem('customJs') || '';

    // Function Definitions
    function renderPages() {
        pageList.innerHTML = '';
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedPages = pages.slice(start, start + itemsPerPage);
        paginatedPages.forEach((page, index) => {
            const li = document.createElement('li');
            li.className = 'border-b py-2';
            li.textContent = page.title;
            li.addEventListener('click', () => selectPage(index + start));
            pageList.appendChild(li);
        });
    }

    function updatePagination() {
        if (currentPage > totalPages()) currentPage = totalPages();
    }

    function totalPages() {
        return Math.ceil(pages.length / itemsPerPage);
    }

    function selectPage(index) {
        selectedPage = index;
        editPageContent.value = pages[index].content;
    }

    function addPage() {
        if (newPageTitle.value && newPageContent.value) {
            pages.push({ title: newPageTitle.value, content: newPageContent.value });
            newPageTitle.value = '';
            newPageContent.value = '';
            updatePagination();
            savePages();
            renderPages();
        }
    }

    function updatePage() {
        if (selectedPage !== null) {
            pages[selectedPage].content = editPageContent.value;
            savePages();
            renderPages();
        }
    }

    function deletePage() {
        if (selectedPage !== null) {
            pages.splice(selectedPage, 1);
            selectedPage = null;
            updatePagination();
            savePages();
            renderPages();
        }
    }

    function savePages() {
        localStorage.setItem('pages', JSON.stringify(pages));
    }

    function saveToFile() {
        const blob = new Blob([JSON.stringify(pages, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wiki_pages.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPages();
        }
    }

    function nextPage() {
        if (currentPage < totalPages()) {
            currentPage++;
            renderPages();
        }
    }

    function toggleFabMenu() {
        fabMenuVisible = !fabMenuVisible;
        fabMenu.style.display = fabMenuVisible ? 'flex' : 'none';
    }

    function toggleSettingsModal() {
        settingsModalVisible = !settingsModalVisible;
        settingsModal.style.display = settingsModalVisible ? 'flex' : 'none';
    }

    function applySettings() {
        document.getElementById('custom-css').innerHTML = customCssTextarea.value;
        document.getElementById('custom-js').innerHTML = customJsTextarea.value;
        localStorage.setItem('customCss', customCssTextarea.value);
        localStorage.setItem('customJs', customJsTextarea.value);
        settingsModal.style.display = 'none';
    }

    // Event Listeners
    document.getElementById('addPageBtn').addEventListener('click', addPage);
    document.getElementById('updatePageBtn').addEventListener('click', updatePage);
    document.getElementById('deletePageBtn').addEventListener('click', deletePage);
    document.getElementById('savePagesBtn').addEventListener('click', savePages);
    document.getElementById('saveToFileBtn').addEventListener('click', saveToFile);
    document.getElementById('prevPageBtn').addEventListener('click', prevPage);
    document.getElementById('nextPageBtn').addEventListener('click', nextPage);
    document.getElementById('toggleFabMenuBtn').addEventListener('click', toggleFabMenu);
    document.getElementById('toggleSettingsModalBtn').addEventListener('click', toggleSettingsModal);
    document.getElementById('applySettingsBtn').addEventListener('click', applySettings);

    // Initial Render
    renderPages();
});
