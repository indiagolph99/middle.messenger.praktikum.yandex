import { BlockBasic, BlockWithSlot } from '$core/tests/mocks/Block.mocks';

describe('Block module', () => {
  it('Block instance returns intact template', () => {
    const block = new BlockBasic();
    const content = block.getContent();

    expect(content?.outerHTML).toMatch(
      /<div data-id="(.+)">i am a block!<\/div>/,
    );
  });

  it('Block instance returns with children', () => {
    const child = new BlockBasic();
    const parent = new BlockWithSlot({ slot: child });
    const content = parent.getContent();

    expect(content?.outerHTML).toMatch(
      /<div data-id="(.+)"><div data-id="(.+)">i am a block!(?:<\/div>){2}/,
    );
  });

  it('Block dispatches CDM upon creation', () => {
    const block = new BlockBasic();
    block.dispatchComponentDidMount();

    expect(BlockBasic.CDM).toBeCalledTimes(1);
  });

  it('setProps method triggers CDU', () => {
    const block = new BlockBasic();
    block.setProps({ foo: 'bar' });

    expect(BlockBasic.CDU).toBeCalledTimes(1);
  });

  it('setProps sets correctly', () => {
    const block = new BlockBasic();
    block.setProps({ foo: 'bar' });
    block.setProps({ bar: 'baz' });
    block.setProps({ foo: 'xyz' });

    expect(block.getProps()).toMatchObject({
      foo: 'xyz',
      bar: 'baz',
    });
  });
});
