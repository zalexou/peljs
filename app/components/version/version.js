'use strict';

angular.module('pel.version', [
  'pel.version.interpolate-filter',
  'pel.version.version-directive'
])

.value('version', '0.1');
