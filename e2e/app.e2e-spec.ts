import { MultiTargetPage } from './app.po';

describe('multi-target App', function() {
  let page: MultiTargetPage;

  beforeEach(() => {
    page = new MultiTargetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
