// (C) 2023 GoodData Corporation
import React, { createContext, useContext, useEffect, useState } from "react";
import noop from "lodash/noop.js";
import isEmpty from "lodash/isEmpty.js";
import { ICatalogAttributeHierarchy, ObjRef } from "@gooddata/sdk-model";

import { useBackendProvider } from "./useBackendProvider.js";
import { EmptyParamCallback, IAttributeData, ICatalogAttributeData, SaveOrUpdateCallback } from "./types.js";
import { findCatalogAttributeByRef } from "./utils.js";

interface IAttributeHierarchyDialogProviderProps {
    initialAttributeRef?: ObjRef;
    editingAttributeHierarchy?: ICatalogAttributeHierarchy;
    onClose?: EmptyParamCallback;
    onSaveOrUpdate?: SaveOrUpdateCallback;
    onDelete?: EmptyParamCallback;
    children: React.ReactNode;
}

type ActionCallback = (rowIndex: number) => void;
type AsyncActionCallback = (rowIndex: number) => Promise<ICatalogAttributeData[]>;
type CompleteAttributeCallback = (selectedItem: ICatalogAttributeData, rowIndex: number) => void;
type UpdateTileCallback = (title: string) => void;
type SaveAttributeHierarchyCallback = () => void;
type SetDisplayConfirmationCallback = (isDisplay: boolean) => void;

export interface IAttributeHierarchyDialogProviderData {
    isEditing: boolean;
    catalogAttributes: ICatalogAttributeData[];
    attributes: IAttributeData[];
    title: string;
    isLoading: boolean;
    shouldDisplayDeleteConfirmation: boolean;
    setDisplayDeleteConfirmation: SetDisplayConfirmationCallback;
    onClose: EmptyParamCallback;
    onUpdateTitle: UpdateTileCallback;
    onAddEmptyAttribute: ActionCallback;
    onCompleteAttribute: CompleteAttributeCallback;
    getValidAttributes: AsyncActionCallback;
    onDeleteAttribute: ActionCallback;
    onSaveAttributeHierarchy: SaveAttributeHierarchyCallback;
    onDeleteAttributeHierarchy: EmptyParamCallback;
}

export const AttributeHierarchyDialogProviderContext = createContext<IAttributeHierarchyDialogProviderData>({
    isEditing: false,
    catalogAttributes: [],
    attributes: [],
    title: "",
    isLoading: true,
    shouldDisplayDeleteConfirmation: false,
    setDisplayDeleteConfirmation: noop,
    onClose: noop,
    onUpdateTitle: noop,
    onAddEmptyAttribute: noop,
    onCompleteAttribute: noop,
    onDeleteAttribute: noop,
    onSaveAttributeHierarchy: noop,
    onDeleteAttributeHierarchy: noop,
    getValidAttributes: () => Promise.resolve([]),
});

export const useAttributeHierarchyDialog = () =>
    useContext<IAttributeHierarchyDialogProviderData>(AttributeHierarchyDialogProviderContext);

export const AttributeHierarchyDialogProvider: React.FC<IAttributeHierarchyDialogProviderProps> = ({
    initialAttributeRef,
    editingAttributeHierarchy,
    children,
    onClose,
    onSaveOrUpdate,
}) => {
    const [title, setTitle] = useState(editingAttributeHierarchy?.attributeHierarchy?.title ?? "");
    const [attributes, setAttributes] = useState<IAttributeData[]>([]);

    const { isLoading, catalogAttributes, onSaveAttributeHierarchy, onDeleteAttributeHierarchy, getValidAttributes } =
        useBackendProvider({
            title,
            attributes,
            editingAttributeHierarchy,
            onClose,
            onSaveOrUpdate,
        });

    const [shouldDisplayDeleteConfirmation, setDisplayDeleteConfirmation] = useState<boolean>();
    const isEditing = !!editingAttributeHierarchy;

    const handleAddEmptyAttribute: ActionCallback = (rowIndex: number) => {
        const newAttributes = [...attributes].filter((attribute) => attribute.completed);
        newAttributes.splice(rowIndex + 1, 0, {});
        setAttributes(newAttributes);
    };

    const handleCompeteAttribute: CompleteAttributeCallback = (
        selectedAttribute: ICatalogAttributeData,
        rowIndex: number,
    ) => {
        const attribute: IAttributeData = {
            ...selectedAttribute,
            completed: true,
        };

        const newAttributes = [...attributes];
        newAttributes[rowIndex] = attribute;

        setAttributes(newAttributes);
    };

    const handleDeleteAttribute: ActionCallback = (rowIndex: number) => {
        const newAttributes = [...attributes];
        newAttributes.splice(rowIndex, 1);
        setAttributes(newAttributes);
    };

    useEffect(() => {
        if (editingAttributeHierarchy && !isEmpty(catalogAttributes)) {
            const initAttributes = editingAttributeHierarchy.attributeHierarchy.attributes
                .map((ref) => (
                    findCatalogAttributeByRef(catalogAttributes, ref)
                ))
                .filter(Boolean)
                .map((attribute) => ({
                    ...attribute,
                    completed: true,
                }));
            setAttributes(initAttributes);
            return;
        }

        if (initialAttributeRef && !isEmpty(catalogAttributes)) {
            const initialAttribute = findCatalogAttributeByRef(catalogAttributes, initialAttributeRef);
            if (initialAttribute) {
                setAttributes([
                    {
                        ...initialAttribute,
                        completed: true,
                    },
                ]);
            }
        }
    }, [initialAttributeRef, editingAttributeHierarchy, catalogAttributes]);

    return (
        <AttributeHierarchyDialogProviderContext.Provider
            value={{
                isEditing,
                catalogAttributes,
                attributes,
                title,
                isLoading,
                shouldDisplayDeleteConfirmation,
                setDisplayDeleteConfirmation,
                onClose,
                onUpdateTitle: setTitle,
                onAddEmptyAttribute: handleAddEmptyAttribute,
                onCompleteAttribute: handleCompeteAttribute,
                getValidAttributes,
                onDeleteAttribute: handleDeleteAttribute,
                onSaveAttributeHierarchy,
                onDeleteAttributeHierarchy,
            }}
        >
            {children}
        </AttributeHierarchyDialogProviderContext.Provider>
    );
};
