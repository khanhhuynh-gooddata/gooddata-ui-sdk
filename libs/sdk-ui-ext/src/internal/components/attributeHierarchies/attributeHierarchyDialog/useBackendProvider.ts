// (C) 2023 GoodData Corporation
import { useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import compact from "lodash/compact.js";
import { messages, useBackendStrict, useWorkspaceStrict } from "@gooddata/sdk-ui";
import { useToastMessage } from "@gooddata/sdk-ui-kit";
import { ICatalogAttributeHierarchy, ObjRef } from "@gooddata/sdk-model";

import { EmptyParamCallback, IAttributeData, ICatalogAttributeData, SaveOrUpdateCallback } from "./types.js";
import { convertToCatalogAttributeData, findCatalogAttributeByRef } from "./utils.js";

interface IUseBackendProvideDataProps {
    title: string;
    attributes: IAttributeData[];
    editingAttributeHierarchy: ICatalogAttributeHierarchy;
    onSaveOrUpdate?: SaveOrUpdateCallback;
    onDelete?: EmptyParamCallback;
    onClose: EmptyParamCallback;
}

export const useBackendProvider = (params: IUseBackendProvideDataProps) => {
    const { title, attributes, editingAttributeHierarchy, onSaveOrUpdate, onClose, onDelete } = params;
    const { formatMessage } = useIntl();
    const backend = useBackendStrict();
    const workspace = useWorkspaceStrict();
    const { addSuccess } = useToastMessage();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [catalogAttributes, setCatalogAttributes] = useState<ICatalogAttributeData[]>([]);

    const getValidAttributes = useCallback(
        async (rowIndex: number) => {
            const attribute = attributes[rowIndex - 1] ?? attributes[rowIndex + 1];
            if (attribute) {
                return backend
                    .workspace(workspace)
                    .attributeHierarchies()
                    .getValidDescendants([attribute.ref])
                    .then((refs) => {
                        const validAttributes = compact(
                            refs.map((ref) => findCatalogAttributeByRef(catalogAttributes, ref)),
                        );
                        return Promise.resolve(validAttributes);
                    });
            } else {
                return catalogAttributes;
            }
        },
        [attributes, backend, catalogAttributes, workspace],
    );

    const handleCreateAttributeHierarchy = (savingTitle: string, attributeRefs: ObjRef[]) => {
        backend
            .workspace(workspace)
            .attributeHierarchies()
            .createAttributeHierarchy(savingTitle, attributeRefs)
            .then((attributeHierarchy) => {
                if (onSaveOrUpdate) {
                    onSaveOrUpdate(attributeHierarchy);
                }
                setLoading(false);
                addSuccess(messages.hierarchyCreateSuccessMessage);
                onClose();
            });
    }

    const handleUpdateAttributeHierarchy = (savingTitle: string, attributeRefs: ObjRef[]) => {
        backend
            .workspace(workspace)
            .attributeHierarchies()
            .updateAttributeHierarchy({
                ...editingAttributeHierarchy,
                attributeHierarchy: {
                    ...editingAttributeHierarchy.attributeHierarchy,
                    title: savingTitle,
                    attributes: attributeRefs,
                },
            })
            .then((attributeHierarchy) => {
                if (onSaveOrUpdate) {
                    onSaveOrUpdate(attributeHierarchy);
                }
                setLoading(false);
                addSuccess(messages.hierarchyUpdateSuccessMessage);
                onClose();
            });
    }

    const onSaveAttributeHierarchy = () => {
        setLoading(true);
        const savingTitle = title || formatMessage(messages.hierarchyUntitled);
        // There maybe some attributes that are not completed, so we need to filter them out
        const attributeRefs = attributes
            .filter((attribute) => attribute.completed)
            .map((attribute) => attribute.ref);

        if (editingAttributeHierarchy) {
            handleUpdateAttributeHierarchy(savingTitle, attributeRefs);
        } else {
            handleCreateAttributeHierarchy(savingTitle, attributeRefs);
        }
    };

    const onDeleteAttributeHierarchy = () => {
        backend
            .workspace(workspace)
            .attributeHierarchies()
            .deleteAttributeHierarchy(editingAttributeHierarchy.attributeHierarchy.id)
            .then(() => {
                if (onDelete) {
                    onDelete();
                }
                addSuccess(messages.hierarchyDeleteSuccessMessage);
                onClose();
            });
    };

    // Prepare all catalog attributes
    useEffect(() => {
        backend
            .workspace(workspace)
            .catalog()
            .forTypes(["attribute", "dateDataset"])
            .load()
            .then((catalog) => {
                setCatalogAttributes(convertToCatalogAttributeData(catalog));
                setLoading(false);
            });
    }, [workspace, backend]);

    return {
        isLoading,
        catalogAttributes,
        onSaveAttributeHierarchy,
        onDeleteAttributeHierarchy,
        getValidAttributes,
    };
};
