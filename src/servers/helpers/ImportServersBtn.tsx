import { useRef, RefObject, ChangeEvent, MutableRefObject, FC, useState, useEffect } from 'react';
import { Button, UncontrolledTooltip } from 'reactstrap';
import { complement, pipe } from 'ramda';
import { faFileUpload as importIcon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '../../utils/helpers/hooks';
import { ServersImporter } from '../services/ServersImporter';
import { ServerData, ServersMap } from '../data';
import { DuplicatedServersModal } from './DuplicatedServersModal';
import './ImportServersBtn.scss';

type Ref<T> = RefObject<T> | MutableRefObject<T>;

export interface ImportServersBtnProps {
  onImport?: () => void;
  onImportError?: (error: Error) => void;
  tooltipPlacement?: 'top' | 'bottom';
  className?: string;
}

interface ImportServersBtnConnectProps extends ImportServersBtnProps {
  createServers: (servers: ServerData[]) => void;
  servers: ServersMap;
  fileRef: Ref<HTMLInputElement>;
}

const serversFiltering = (servers: ServerData[]) =>
  ({ url, apiKey }: ServerData) => servers.some((server) => server.url === url && server.apiKey === apiKey);

const ImportServersBtn = ({ importServersFromFile }: ServersImporter): FC<ImportServersBtnConnectProps> => ({
  createServers,
  servers,
  fileRef,
  children,
  onImport = () => {},
  onImportError = () => {},
  tooltipPlacement = 'bottom',
  className = '',
}) => {
  const ref = fileRef ?? useRef<HTMLInputElement>();
  const [ serversToCreate, setServersToCreate ] = useState<ServerData[] | undefined>();
  const [ duplicatedServers, setDuplicatedServers ] = useState<ServerData[]>([]);
  const [ isModalOpen,, showModal, hideModal ] = useToggle();
  const create = pipe(createServers, onImport);
  const createAllServers = pipe(() => create(serversToCreate ?? []), hideModal);
  const createNonDuplicatedServers = pipe(
    () => create((serversToCreate ?? []).filter(complement(serversFiltering(duplicatedServers)))),
    hideModal,
  );
  const onFile = async ({ target }: ChangeEvent<HTMLInputElement>) =>
    importServersFromFile(target.files?.[0])
      .then(setServersToCreate)
      .then(() => {
        // Reset input after processing file
        (target as { value: string | null }).value = null;
      })
      .catch(onImportError);

  useEffect(() => {
    if (!serversToCreate) {
      return;
    }

    const existingServers = Object.values(servers);
    const duplicatedServers = serversToCreate.filter(serversFiltering(existingServers));
    const hasDuplicatedServers = !!duplicatedServers.length;

    !hasDuplicatedServers ? create(serversToCreate) : setDuplicatedServers(duplicatedServers);
    hasDuplicatedServers && showModal();
  }, [ serversToCreate ]);

  return (
    <>
      <Button outline id="importBtn" className={className} onClick={() => ref.current?.click()}>
        <FontAwesomeIcon icon={importIcon} fixedWidth /> {children ?? 'Import from file'}
      </Button>
      <UncontrolledTooltip placement={tooltipPlacement} target="importBtn">
        You can create servers by importing a CSV file with columns <b>name</b>, <b>apiKey</b> and <b>url</b>.
      </UncontrolledTooltip>

      <input type="file" accept="text/csv" className="import-servers-btn__csv-select" ref={ref} onChange={onFile} />

      <DuplicatedServersModal
        isOpen={isModalOpen}
        duplicatedServers={duplicatedServers}
        onDiscard={createNonDuplicatedServers}
        onSave={createAllServers}
      />
    </>
  );
};

export default ImportServersBtn;
