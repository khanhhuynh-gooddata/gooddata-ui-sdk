// (C) 2023 GoodData Corporation
import React from "react";
import cx from "classnames";
import { useIntl } from "react-intl";
import { messages } from "@gooddata/sdk-ui";
import { Button } from "@gooddata/sdk-ui-kit";

/**
 *
 * @alpha
 */
export interface IAttributeHierarchyDetailItem {
    title: string;
    isDate: boolean;
}

/**
 *
 * @alpha
 */
export interface IAttributeHierarchyDetailPanelProps {
    title: string;
    description?: string;
    attributes: IAttributeHierarchyDetailItem[];
    onEdit?: () => void;
}

/**
 *
 * @alpha
 */
export const AttributeHierarchyDetailPanel: React.FC<IAttributeHierarchyDetailPanelProps> = ({
    title,
    description,
    attributes,
    onEdit,
}) => {
    const { formatMessage } = useIntl();
    const hierarchyLevelsText = formatMessage(messages.hierarchyListLevels);
    const editText = formatMessage(messages.hierarchyListEdit);

    return (
        <div className="gd-attribute-hierarchy-detail-panel">
            <div className="gd-attribute-hierarchy-detail-title">{title}</div>
            {description && <div className="gd-attribute-hierarchy-detail-description">{description}</div>}
            <div className="gd-attribute-hierarchy-detail-levels">{hierarchyLevelsText}</div>
            {attributes.map((item, index) => {
                const itemClassNames = cx("gd-attribute-hierarchy-detail-item", {
                    "is-date": item.isDate,
                    "is-attribute": !item.isDate,
                });
                return (
                    <div key={index} className={itemClassNames}>
                        {item.title}
                    </div>
                );
            })}

            {onEdit ? (
                <Button
                    className="gd-button-secondary gd-icon-edit gd-button-small"
                    value={editText}
                    onClick={onEdit}
                />
            ) : null}
        </div>
    );
};
