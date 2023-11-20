// (C) 2023 GoodData Corporation
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@gooddata/sdk-ui-kit";

import { messages } from "@gooddata/sdk-ui";
import { useAttributeHierarchyDialog } from "./AttributeHierarchyDialogProvider.js";

const HOW_TO_WORK_DOCUMENTATION_LINK = "";

const AttributeHierarchyDialogFooter: React.FC = () => {
    const { formatMessage } = useIntl();
    const { isEditing, onSaveAttributeHierarchy, onClose, setDisplayDeleteConfirmation } =
        useAttributeHierarchyDialog();

    const onDelete = () => {
        setDisplayDeleteConfirmation(true);
    };

    const deleteText = formatMessage(messages.hierarchyDeleteButton);
    const cancelText = formatMessage(messages.hierarchyCancelButton);
    const saveText = formatMessage(messages.hierarchyCreateButton);

    return (
        <div className="gd-dialog-footer">
            <div className="gd-dialog-footer-tip">
                <span className="gd-icon-circle-question s-gd-icon-circle-question" />
                <a
                    href={HOW_TO_WORK_DOCUMENTATION_LINK}
                    className="gd-button-link-dimmed"
                    target="_blank"
                    rel="noreferrer"
                >
                    <FormattedMessage id={messages.hierarchyAttributeHowToWork.id} />
                </a>
            </div>
            <div className="gd-dialog-footer-actions s-gd-dialog-footer-actions">
                {isEditing ? (
                    <Button
                        className="gd-button-link-dimmed attribute-hierarchy-delete-button s-attribute-hierarchy-delete-button"
                        value={deleteText}
                        onClick={onDelete}
                    />
                ) : null}
                <Button
                    className="gd-button-secondary attribute-hierarchy-cancel-button s-attribute-hierarchy-cancel-button"
                    value={cancelText}
                    onClick={onClose}
                />
                <Button
                    className="gd-button-action attribute-hierarchy-save-button s-attribute-hierarchy-save-button"
                    value={saveText}
                    onClick={onSaveAttributeHierarchy}
                />
            </div>
        </div>
    );
};

export default AttributeHierarchyDialogFooter;
