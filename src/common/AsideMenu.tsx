import {
  faList as listIcon,
  faLink as createIcon,
  faTags as tagsIcon,
  faPen as editIcon,
  faHome as overviewIcon,
  faGlobe as domainsIcon,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import classNames from 'classnames';
import { Location } from 'history';
import { DeleteServerButtonProps } from '../servers/DeleteServerButton';
import { isServerWithId, SelectedServer } from '../servers/data';
import { supportsDomainRedirects } from '../utils/helpers/features';
import './AsideMenu.scss';

export interface AsideMenuProps {
  selectedServer: SelectedServer;
  className?: string;
  showOnMobile?: boolean;
}

interface AsideMenuItemProps extends NavLinkProps {
  to: string;
}

const AsideMenuItem: FC<AsideMenuItemProps> = ({ children, to, className, ...rest }) => (
  <NavLink
    className={classNames('aside-menu__item', className)}
    activeClassName="aside-menu__item--selected"
    to={to}
    {...rest}
  >
    {children}
  </NavLink>
);

const AsideMenu = (DeleteServerButton: FC<DeleteServerButtonProps>) => (
  { selectedServer, showOnMobile = false }: AsideMenuProps,
) => {
  const hasId = isServerWithId(selectedServer);
  const serverId = hasId ? selectedServer.id : '';
  const addManageDomainsLink = supportsDomainRedirects(selectedServer);
  const asideClass = classNames('aside-menu', {
    'aside-menu--hidden': !showOnMobile,
  });
  const shortUrlsIsActive = (_: null, location: Location) => location.pathname.match('/list-short-urls') !== null;
  const buildPath = (suffix: string) => `/server/${serverId}${suffix}`;

  return (
    <aside className={asideClass}>
      <nav className="nav flex-column aside-menu__nav">
        <AsideMenuItem to={buildPath('/overview')}>
          <FontAwesomeIcon fixedWidth icon={overviewIcon} />
          <span className="aside-menu__item-text">Overview</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/list-short-urls/1')} isActive={shortUrlsIsActive}>
          <FontAwesomeIcon fixedWidth icon={listIcon} />
          <span className="aside-menu__item-text">List short URLs</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/create-short-url')}>
          <FontAwesomeIcon fixedWidth icon={createIcon} flip="horizontal" />
          <span className="aside-menu__item-text">Create short URL</span>
        </AsideMenuItem>
        <AsideMenuItem to={buildPath('/manage-tags')}>
          <FontAwesomeIcon fixedWidth icon={tagsIcon} />
          <span className="aside-menu__item-text">Manage tags</span>
        </AsideMenuItem>
        {addManageDomainsLink && (
          <AsideMenuItem to={buildPath('/manage-domains')}>
            <FontAwesomeIcon fixedWidth icon={domainsIcon} />
            <span className="aside-menu__item-text">Manage domains</span>
          </AsideMenuItem>
        )}
        <AsideMenuItem to={buildPath('/edit')} className="aside-menu__item--push">
          <FontAwesomeIcon fixedWidth icon={editIcon} />
          <span className="aside-menu__item-text">Edit this server</span>
        </AsideMenuItem>
        {hasId && (
          <DeleteServerButton
            className="aside-menu__item aside-menu__item--danger"
            textClassName="aside-menu__item-text"
            server={selectedServer}
          />
        )}
      </nav>
    </aside>
  );
};

export default AsideMenu;
