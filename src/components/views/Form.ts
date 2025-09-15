import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (!this._submit.disabled) {
                this.events.emit(`${this.container.name}:submit`);
            }
        });
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    render(data: T): HTMLElement {
        super.render(data);
        return this.container;
    }
}