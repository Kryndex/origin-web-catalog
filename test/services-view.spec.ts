import * as angular from 'angular';
import 'angular-mocks';

import {TestHelpers} from '../test/utils/testHelpers';
import {ComponentTest} from '../test/utils/ComponentTest';
import {ServicesViewController} from '../src/components/services-view/services-view.controller';
import {servicesData} from '../app/mockServices/mockData/services';
import {imagesData} from '../app/mockServices/mockData/openshift-images';

describe('servicesView', () => {
  var services: any, images: any;
  var componentTest: ComponentTest<ServicesViewController>;
  var testHelpers: TestHelpers = new TestHelpers();

  beforeEach( () => {
    testHelpers.initTests();

    angular.mock.module('webCatalog', 'openshiftCommonUI', 'mockServices');
  });

  beforeEach(() => {
    services = angular.copy(servicesData);
    images = angular.copy(imagesData);
  });

  beforeEach(() => {
    componentTest = new ComponentTest<ServicesViewController>(
        '<services-view service-classes=\"services\" image-streams=\"images\"></services-view>'
    );
    var attributes: any = { services: services, images: images};
    componentTest.createComponent(attributes);
  });

  // testing the isoScope $ctrl
  it('should have the correct $ctrl properties', () => {
    var ctrl = componentTest.isoScope.$ctrl;
    expect(ctrl.currentFilter).toBe('all');
    expect(ctrl.currentSubFilter).toBeNull();
    expect(ctrl.orderingPanelvisible).toBe(false);
  });

  it('should display the initial categories and correct number of catalog cards', () => {
    var element = componentTest.rawElement;
    // 4 main categories ('All', 'Languages', 'Databases', 'Other')
    // 'Middleware' should be hidden since mock data has no items with Middleware sub-categories
    // 'CI/CD' should be hidden because it's only item 'Jenkins' is not a builder image
    expect(jQuery(element).find('.services-categories a').length).toBe(4);

    // 'All' category should be selected and the current filter
    expect(jQuery(element).find('.services-categories .current-filter').html()).toBe('All');

    // 14 cards/services
    expect(jQuery(element).find('.card-name').length).toBe(14);
  });

  it('should filter sub-categories and cards when main category is clicked', () => {
    var element = componentTest.rawElement;

    componentTest.eventFire(element.querySelector('#category-languages'), 'click');

    // 7 sub categories under category 'Languages' ('All', 'Java', 'Javascript',...'Python')
    expect(jQuery(element).find('.sub-cat-label').length).toBe(7);

    // 11 'language' cards/services
    expect(jQuery(element).find('.card-name').length).toBe(11);
  });

  it('should filter cards when sub-category is clicked', () => {
    var element = componentTest.rawElement;
    componentTest.eventFire(element.querySelector('#category-databases'), 'click');
    componentTest.eventFire(element.querySelector('#sub-category-mongodb .inner-content'), 'click');
    // MongoDB image not shown because it isn't a builder image.
    expect(jQuery(element).find('.card-name').length).toBe(2);
  });

  it('should show/hide cards when same sub-category is clicked twice', () => {
    var element = componentTest.rawElement;
    componentTest.eventFire(element.querySelector('#category-databases'), 'click');
    componentTest.eventFire(element.querySelector('#sub-category-mongodb .inner-content'), 'click');
    expect(jQuery(element).find('.card-name').length).toBe(2);
    componentTest.eventFire(element.querySelector('#sub-category-mongodb .inner-content'), 'click');
    expect(jQuery(element).find('.card-name').length).toBe(0);
  });

  it("should categorize 'Other' items", () => {
    var element = componentTest.rawElement;

    componentTest.eventFire(element.querySelector('#category-other'), 'click');

    // 1 'other' card
    expect(jQuery(element).find('.card-name').length).toBe(1);
  });

});
