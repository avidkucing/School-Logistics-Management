export interface FormType {
    name: string;
    type: string;
    required: boolean;
    label: string;
    options?: FormType[];
    disabled?: boolean;
    value?: string;
}