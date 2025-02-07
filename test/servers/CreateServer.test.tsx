import { shallow, ShallowWrapper } from 'enzyme';
import { Mock } from 'ts-mockery';
import { History } from 'history';
import createServerConstruct from '../../src/servers/CreateServer';
import { ServerForm } from '../../src/servers/helpers/ServerForm';
import { ServerWithId } from '../../src/servers/data';
import { DuplicatedServersModal } from '../../src/servers/helpers/DuplicatedServersModal';

describe('<CreateServer />', () => {
  let wrapper: ShallowWrapper;
  const ImportServersBtn = () => null;
  const createServerMock = jest.fn();
  const push = jest.fn();
  const goBack = jest.fn();
  const historyMock = Mock.of<History>({ push, goBack });
  const servers = { foo: Mock.all<ServerWithId>() };
  const createWrapper = (serversImported = false, importFailed = false) => {
    const useStateFlagTimeout = jest.fn()
      .mockReturnValueOnce([ serversImported, () => '' ])
      .mockReturnValueOnce([ importFailed, () => '' ])
      .mockReturnValue([]);
    const CreateServer = createServerConstruct(ImportServersBtn, useStateFlagTimeout);

    wrapper = shallow(<CreateServer createServer={createServerMock} history={historyMock} servers={servers} />);

    return wrapper;
  };

  beforeEach(jest.clearAllMocks);
  afterEach(() => wrapper?.unmount());

  it('renders components', () => {
    const wrapper = createWrapper();

    expect(wrapper.find(ServerForm)).toHaveLength(1);
    expect(wrapper.find('ImportResult')).toHaveLength(0);
  });

  it('shows success message when imported is true', () => {
    const wrapper = createWrapper(true);
    const result = wrapper.find('ImportResult');

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('success');
  });

  it('shows error message when import failed', () => {
    const wrapper = createWrapper(false, true);
    const result = wrapper.find('ImportResult');

    expect(result).toHaveLength(1);
    expect(result.prop('type')).toEqual('error');
  });

  it('creates server data when form is submitted', () => {
    const wrapper = createWrapper();
    const form = wrapper.find(ServerForm);

    expect(wrapper.find(DuplicatedServersModal).prop('duplicatedServers')).toEqual([]);
    form.simulate('submit', {});
    expect(wrapper.find(DuplicatedServersModal).prop('duplicatedServers')).toEqual([{}]);
  });

  it('saves server and redirects on modal save', () => {
    const wrapper = createWrapper();

    wrapper.find(ServerForm).simulate('submit', {});
    wrapper.find(DuplicatedServersModal).simulate('save');

    expect(createServerMock).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledTimes(1);
  });

  it('goes back on modal discard', () => {
    const wrapper = createWrapper();

    wrapper.find(DuplicatedServersModal).simulate('discard');

    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
