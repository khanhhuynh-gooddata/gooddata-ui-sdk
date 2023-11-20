// (C) 2023 GoodData Corporation
import React from "react";
import { useIntl } from "react-intl";
import { Button, Separator } from "@gooddata/sdk-ui-kit";
import { messages } from "@gooddata/sdk-ui";

interface IAttributeHierarchyListFooterProps {
    onClick: () => void;
}

const AttributeHierarchyListFooter: React.FC<IAttributeHierarchyListFooterProps> = ({ onClick }) => {
    const { formatMessage } = useIntl();

    const createHierarchyText = formatMessage(messages.hierarchyCreateButton);

    return (
        <div className="attribute-hierarchy-list-footer s-attribute-hierarchy-list-footer">
            <Separator />
            <Button
                className="gd-button-link-dimmed gd-icon-plus attribute-hierarchy-list-footer-button s-attribute-hierarchy-list-footer-button"
                value={createHierarchyText}
                onClick={onClick}
            />
        </div>
    );
};

export default AttributeHierarchyListFooter;
