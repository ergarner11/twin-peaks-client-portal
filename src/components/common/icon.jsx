import React from 'react';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { ReactComponent as AddIcon } from '../../assets/add-icon.svg';
import { ReactComponent as BankIcon } from '../../assets/bank-icon.svg';
import { ReactComponent as CalendarIcon } from '../../assets/calendar-icon.svg';
import { ReactComponent as CatIcon } from '../../assets/cat-icon.svg';
import { ReactComponent as CheckMarkIcon } from '../../assets/check-mark-icon.svg';
import { ReactComponent as ClientOnHoldIcon } from '../../assets/client-on-hold-icon.svg';
import { ReactComponent as CloseIcon } from '../../assets/close-icon.svg';
import { ReactComponent as CollectionsIcon } from '../../assets/collections-icon.svg';
import { ReactComponent as DeceasedIcon } from '../../assets/deceased-icon.svg';
import { ReactComponent as DentalIcon } from '../../assets/dental-icon.svg';
import { ReactComponent as DogIcon } from '../../assets/dog-icon.svg';
import { ReactComponent as HomeIcon } from '../../assets/home-icon.svg';
import { ReactComponent as LessIcon } from '../../assets/less-icon.svg';
import { ReactComponent as MoreIcon } from '../../assets/more-icon.svg';
import { ReactComponent as NotRenewingIcon } from '../../assets/not-renewing-icon.svg';
import { ReactComponent as OnHoldIcon } from '../../assets/on-hold-icon.svg';
import { ReactComponent as RightArrowIcon } from '../../assets/right-arrow-icon.svg';
import { ReactComponent as SubtractIcon } from '../../assets/subtract-icon.svg';
import { ReactComponent as UserIcon } from '../../assets/user-icon.svg';
import { ReactComponent as WaitingPeriodIcon } from '../../assets/waiting-period-icon.svg';

function Icon({ name, tooltipText, className, style }) {
  let icon;
  let defaultTooltipText;

  switch (name) {
    case 'add':
      icon = <AddIcon className={className} />;
      break;
    case 'bank':
      icon = <BankIcon className={className} />;
      break;
    case 'calendar':
      icon = <CalendarIcon className={className} />;
      break;
    case 'cat':
      icon = <CatIcon className={className} />;
      defaultTooltipText = 'Feline';
      break;
    case 'check_mark':
      icon = <CheckMarkIcon className={className} />;
      break;
    case 'client_on_hold':
      icon = <ClientOnHoldIcon className={className} />;
      defaultTooltipText = 'On Hold - Another Plan has an outstanding balance';
      break;
    case 'close':
      icon = <CloseIcon className={className} />;
      defaultTooltipText = 'Close';
      break;
    case 'collections':
      icon = <CollectionsIcon className={className} />;
      defaultTooltipText = 'In Collections';
      break;
    case 'deceased':
      icon = <DeceasedIcon className={className} />;
      defaultTooltipText = 'Deceased';
      break;
    case 'delete':
      icon = <i className={`fa fa-trash-alt ${className}`} />;
      defaultTooltipText = 'Delete';
      break;
    case 'dental':
      icon = <DentalIcon className={className} />;
      defaultTooltipText = 'Dental Enhanced';
      break;
    case 'dog':
      icon = <DogIcon className={className} />;
      defaultTooltipText = 'Canine';
      break;
    case 'edit':
      icon = <i className={`fa fa-edit ${className}`} />;
      defaultTooltipText = 'Edit';
      break;
    case 'home':
      icon = <HomeIcon className={className} />;
      break;
    case 'less':
      icon = <LessIcon className={className} />;
      break;
    case 'more':
      icon = <MoreIcon className={className} />;
      break;
    case 'not_renewing':
      icon = <NotRenewingIcon className={className} />;
      defaultTooltipText = 'Set to Not Renew';
      break;
    case 'on_hold':
      icon = <OnHoldIcon className={className} />;
      defaultTooltipText = 'On Hold - Plan has an outstanding balance';
      break;
    case 'right_arrow':
      icon = <RightArrowIcon className={className} />;
      break;
    case 'subtract':
      icon = <SubtractIcon className={className} />;
      break;
    case 'user':
      icon = <UserIcon className={className} />;
      break;
    case 'waiting_period':
      icon = <WaitingPeriodIcon className={className} />;
      defaultTooltipText = 'In Waiting Period';
      break;
    default:
      icon = <i className={`${name} ${className}`} style={style} />;
      break;
  }

  const showTooltip = tooltipText || defaultTooltipText;

  if (showTooltip) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip style={{ position: 'fixed' }}>{tooltipText || defaultTooltipText}</Tooltip>
        }
        trigger={['click', 'hover', 'focus']}
      >
        {icon}
      </OverlayTrigger>
    );
  }

  return icon;
}

export default Icon;
