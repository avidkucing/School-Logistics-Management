export interface FormType {
    name: string;
    type: string;
    required: boolean;
    label: string;
    options?: {[x: string]: string}[];
}