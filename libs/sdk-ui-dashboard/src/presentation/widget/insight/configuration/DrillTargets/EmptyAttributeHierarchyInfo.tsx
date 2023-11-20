// (C) 2023 GoodData Corporation
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@gooddata/sdk-ui-kit";
import { messages } from "@gooddata/sdk-ui";

interface IEmptyAttributeHierarchyInfoProps {
    onOpenAttributeHierarchyDialog: () => void;
}

const EMPTY_HIERARCHY_INFO_DOCUMENTATION_LINK = "";

const EmptyAttributeHierarchyInfo: React.FC<IEmptyAttributeHierarchyInfoProps> = ({ onOpenAttributeHierarchyDialog }) => {
    const { formatMessage } = useIntl();

    const addAttributeHierarchyText = formatMessage(messages.createHierarchy);

    return (
        <>
            <div className="empty-attribute-hierarchy-info s-empty-attribute-hierarchy-info">
                <div className="empty-attribute-hierarchy-info-content s-empty-attribute-hierarchy-info-content">
                    <FormattedMessage id={messages.emptyHierarchyInfo.id} tagName="span" />
                    <a
                        href={EMPTY_HIERARCHY_INFO_DOCUMENTATION_LINK}
                        className="gd-button-link-dimmed"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <FormattedMessage id={messages.drillConfigLearnMore.id} />
                    </a>
                </div>
                <Button
                    className="gd-button-link gd-icon-plus gd-button-small add-attribute-hierarchy-button s-add-attribute-hierarchy-button"
                    value={addAttributeHierarchyText}
                    onClick={onOpenAttributeHierarchyDialog}
                />
            </div>
        </>
    );
};

export default EmptyAttributeHierarchyInfo;
