import { EComputerNames } from '@/common/enums/computer.enum';
import { useSettingsDownloadsStore } from '@/stores/settings/download';

const buildDownloadUrl = (invitationLink: string, os: EComputerNames): string => {
  if (!invitationLink) return '';

  try {
    const url = new URL(invitationLink, window.location.origin);
    url.searchParams.set('os', os);
    return url.toString();
  } catch {
    const separator = invitationLink.includes('?') ? '&' : '?';
    return `${invitationLink}${separator}os=${os}`;
  }
};

export const useDownloadApp = () => {
  const downloadsStore = useSettingsDownloadsStore();

  const onDownloadButtonClicked = (isMacos: boolean): void => {
    const url = buildDownloadUrl(
      downloadsStore.InvitationLink,
      isMacos ? EComputerNames.MAC : EComputerNames.WINDOWS,
    );
    if (!url) return;
    window.location.href = url;
  };

  const findActiveComputer = (): boolean => {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  };

  return {
    onDownloadButtonClicked,
    findActiveComputer,
  };
};
