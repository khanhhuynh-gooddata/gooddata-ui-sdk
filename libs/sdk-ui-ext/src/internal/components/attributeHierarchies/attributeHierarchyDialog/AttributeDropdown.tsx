// (C) 2023 GoodData Corporation
import React from "react";
import { useIntl } from "react-intl";
import { Dropdown, DropdownButton } from "@gooddata/sdk-ui-kit";

import { messages } from "@gooddata/sdk-ui";
import AttributeDropdownBody from "./AttributeDropdownBody.js";

interface IAttributeDropdownProps {
    rowIndex: number;
}

const AttributeDropdown: React.FC<IAttributeDropdownProps> = ({ rowIndex }) => {
    const { formatMessage } = useIntl();

    const chooseAttributeText = formatMessage(messages.hierarchyAttributeDropdown);

    return (
        <Dropdown
            className="attribute-hierarchy-attribute-dropdown s-attribute-hierarchy-attribute-dropdown"
            closeOnParentScroll={true}
            closeOnMouseDrag={true}
            closeOnOutsideClick={true}
            openOnInit={true}
            renderButton={({ isOpen, toggleDropdown }) => (
                <DropdownButton
                    className="attribute-heirarchy-attribute-dropdown-button s-attribute-heirarchy-attribute-dropdown-button"
                    value={chooseAttributeText}
                    isOpen={isOpen}
                    isSmall={true}
                    onClick={toggleDropdown}
                />
            )}
            renderBody={({ closeDropdown }) => {
                return <AttributeDropdownBody rowIndex={rowIndex} closeDropdown={closeDropdown} />;
            }}
        />
    );
};

export default AttributeDropdown;
