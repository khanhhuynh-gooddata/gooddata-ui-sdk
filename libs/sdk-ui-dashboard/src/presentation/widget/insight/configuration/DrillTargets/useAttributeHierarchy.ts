// (C) 2023 GoodData Corporation
import { useState } from "react";
import { ICatalogAttributeHierarchy } from "@gooddata/sdk-model";
import { catalogActions } from "../../../../../model/store/catalog/index.js";
import { useDashboardDispatch } from "../../../../../model/index.js";

interface IUseAttributeHierarchy {
    onDeleteInteraction: () => void;
}

export const useAttributeHierarchy = (params: IUseAttributeHierarchy) => {
    const { onDeleteInteraction } = params;
    const dispatch = useDashboardDispatch();

    const [shouldDisplayAttributeHierarchyDialog, setDisplayAttributeHierarchyDialog] = useState(false);
    const [editingAttributeHierarchy, setEditingAttributeHierarchy] = useState<ICatalogAttributeHierarchy | undefined>();

    const onOpenAttributeHierarchyDialog = (attributeHierarchy?: ICatalogAttributeHierarchy) => {
        if (attributeHierarchy) {
            setEditingAttributeHierarchy(attributeHierarchy);
        }
        setDisplayAttributeHierarchyDialog(true);
    };

    const onCloseAttributeHierarchyDialog = () => {
        setDisplayAttributeHierarchyDialog(false);
    };

    const onSaveAttributeHierarchy = (attributeHierarchy?: ICatalogAttributeHierarchy) => {
        if (editingAttributeHierarchy && attributeHierarchy) {
            dispatch(catalogActions.updateAttributeHierarchy(attributeHierarchy));
            return;
        }

        if (attributeHierarchy) {
            onDeleteInteraction();
            dispatch(catalogActions.addAttributeHierarchy(attributeHierarchy));
        }
    };

    const onDeleteAttributeHierarchy = () => {
        if (editingAttributeHierarchy) {
            dispatch(catalogActions.deleteAttributeHierarchy(editingAttributeHierarchy));
        }
    }

    return {
        shouldDisplayAttributeHierarchyDialog,
        editingAttributeHierarchy,
        onOpenAttributeHierarchyDialog,
        onCloseAttributeHierarchyDialog,
        onSaveAttributeHierarchy,
        onDeleteAttributeHierarchy,
    }
}