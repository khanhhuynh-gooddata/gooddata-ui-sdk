// (C) 2021-2023 GoodData Corporation
import { createSelector } from "@reduxjs/toolkit";
import { GoodDataSdkError } from "@gooddata/sdk-ui";

import { selectState } from "../common/selectors";
import { FilterSelector } from "../common/types";
import { AsyncOperationStatus } from "../../../../AttributeFilterHandler/types";

/**
 * @internal
 */
export const selectInitStatus: FilterSelector<AsyncOperationStatus> = createSelector(
    selectState,
    (state) => state.initialization.status,
);

/**
 * @internal
 */
export const selectInitError: FilterSelector<GoodDataSdkError> = createSelector(
    selectState,
    (state) => state.initialization.error,
);
