export type Field = {
    id: string;
    label: string;
    type?: string;
};

export type FormNode = {
    id: string;
    name: string;
    fields: Field[];
    schemaId?: string; 
};

export type Edge = {
    from: string;
    to: string;
};

export type Graph = {
    forms: FormNode[];
    edges: Edge[];
}