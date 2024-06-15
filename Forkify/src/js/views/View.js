import icons from '../../img/icons.svg';

export default class View {
    _data;

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM          = document.createRange().createContextualFragment(newMarkup);
        const newElements     = Array.from(newDOM.querySelectorAll('*'));
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i];

            // Update changed TEXT
            if (! newElement.isEqualNode(currentElement) && newElement.firstChild.nodeValue.trim() !== '') {
                currentElement.textContent = newElement.textContent;
            }

            // Update changed ATTRIBUTES
            if (! newElement.isEqualNode(currentElement)) {
                Array.from(newElement.attributes).forEach(attr => {
                    currentElement.setAttribute(attr.name, attr.value);
                });
            }
        });
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderError(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSuccess(message = this._successMessage) {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                    <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderSpenner () {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}.svg#icon-loader"></use>
                </svg>
            </div>
        `;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    };
}
