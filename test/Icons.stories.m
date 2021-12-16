import { Meta } from '@storybook/addon-docs/blocks';
import LinkTo from '@storybook/addon-links/react';

import Icon from '../../components/Icon/Icon.js';
import IconList from '../docs-components/IconList.js';
import Banner from '../../components/Banner/Banner';
import Text from '../../components/Text/Text.js';
import Flex from '../../components/Flex/Flex.js';
import IconActionAddStroke from '../../design-tokens/design-system-icons/icon-action-add-stroke.js';
import IconColorPropRecommendedUsage from '../../stories/components/Icon/assets/IconColorPropRecommendedUsage.png';
import IconWrapperComponentProps from '../../stories/components/Icon/IconWrapperComponentProps.js';
import PropsTable from '../docs-components/PropsTable.js';

<Meta 
  title="Components/Icon/Icons Library" 
  parameters={{
    viewMode: 'docs',
    previewTabs: { 
      canvas: { hidden: true } 
    },
  }}
/>

# Icons Library

<br />

<Banner status="warning">
  <Text type="body-large">
    <Flex direction="column" shrink={1} gap="spacing-s">
    <Text>
      We strongly recommend <Text type="strong">NOT</Text> providing icon color or any other styles on parent elements which have Icon component used inside them.
      This can cause the underlying Icon component's props like color to work incorrectly. We recommend reading <LinkTo kind="components-icon-warning-on-overriding-icon-color-via-classname--page">this doc</LinkTo> to know in detail about it.
    </Text>
    <img
      src={IconColorPropRecommendedUsage}
      alt="icon color prop recommended usage"
    />
  </Flex>
  </Text>
</Banner>

<br />

### Table of contents
* [Import](#import)
* [Usage](#usage)
* [Props](#props)

### Import
You can use any icon as mentioned in the below list to render. For example:-

```jsx
import { IconActionAddStroke } from '@postman/aether';
```

### Usage
```jsx
<IconActionAddStroke color='content-color-brand' />
```

<IconActionAddStroke color='content-color-brand' />

### Props
<PropsTable rows={IconWrapperComponentProps} />

### Examples

<IconList />

---