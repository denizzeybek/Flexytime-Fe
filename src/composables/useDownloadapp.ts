import { EComputerNames } from '@/common/enums/computer.enum';
import { useSettingsDownloadsStore } from '@/stores/settings/download';

export const useDownloadApp = () => {
  const downloadsStore = useSettingsDownloadsStore();

  const onDownloadButtonClicked = (isMacos: boolean) => {
    window.location.href = `${downloadsStore.InvitationLink}&os=${isMacos ? EComputerNames.MAC : EComputerNames.WINDOWS}`;
  };

  const findActiveComputer = () => {
    return navigator.platform.toUpperCase().indexOf(EComputerNames.MAC) >= 0;
  };

  return {
    onDownloadButtonClicked,
    findActiveComputer,
  };
};
