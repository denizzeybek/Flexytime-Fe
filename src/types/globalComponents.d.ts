import RAlert from '@/components/ui/global/Alert.vue'
import RBackButton from '@/components/ui/global/BackButton.vue'
import RBadge from '@/components/ui/global/Badge.vue'
import RButton from '@/components/ui/global/Button.vue'
import RCheckbox from '@/components/ui/global/Checkbox.vue'
import RDefaultLayoutHeader from '@/components/ui/global/DefaultLayoutHeader.vue'
import RIcon from '@/components/ui/global/Icon.vue'
import RInput from '@/components/ui/global/Input.vue'
import RInputFeedback from '@/components/ui/global/InputFeedback.vue'
import RLabel from '@/components/ui/global/Label.vue'
import RLink from '@/components/ui/global/Link.vue'
import RListEmpty from '@/components/ui/global/ListEmpty.vue'
import RListItem from '@/components/ui/global/ListItem.vue'
import RListItemDropdown from '@/components/ui/global/ListItemDropdown.vue'
import RModal from '@/components/ui/global/Modal.vue'
import ROffCanvas from '@/components/ui/global/OffCanvas.vue'
import RPagination from '@/components/ui/global/Pagination.vue'
import RPhoneInput from '@/components/ui/global/PhoneInput.vue'
import RRadioInputGroup from '@/components/ui/global/RadioInputGroup.vue'
import RRadioOption from '@/components/ui/global/RadioOption.vue'
import RSearchInput from '@/components/ui/global/SearchInput.vue'
import RSelect from '@/components/ui/global/Select.vue'
import RSpinner from '@/components/ui/global/Spinner.vue'
import RTabs from '@/components/ui/global/Tabs.vue'
import RText from '@/components/ui/global/Text.vue'
import RTooltip from '@/components/ui/global/Tooltip.vue'
import RStepper from '@/components/ui/global/Stepper.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    RTabs: typeof RTabs
    RSearchInput: typeof RSearchInput
    RButton: typeof RButton
    RBadge: typeof RBadge
    RListItemDropdown: typeof RListItemDropdown
    ROffCanvas: typeof ROffCanvas
    RRadioOption: typeof RRadioOption
    RSelect: typeof RSelect
    RInput: typeof RInput
    RCheckbox: typeof RCheckbox
    RSpinner: typeof RSpinner
    RListEmpty: typeof RListEmpty
    RPagination: typeof RPagination
    RAlert: typeof RAlert
    RBackButton: typeof RBackButton
    RLink: typeof RLink
    RTooltip: typeof RTooltip
    RPhoneInput: typeof RPhoneInput
    RModal: typeof RModal
    RIcon: typeof RIcon
    RText: typeof RText
    RRadioInputGroup: typeof RRadioInputGroup
    RDefaultLayoutHeader: typeof RDefaultLayoutHeader
    RListItem: typeof RListItem
    RLabel: typeof RLabel
    RStepper: typeof RStepper
    RInputFeedback: typeof RInputFeedback
  }
}
