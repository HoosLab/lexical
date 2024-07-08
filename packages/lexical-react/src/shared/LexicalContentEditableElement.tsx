/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import {forwardRef, Ref, useState} from 'react';
import useLayoutEffect from 'shared/useLayoutEffect';

import {mergeRefs} from './mergeRefs';

export type Props = {
  ariaActiveDescendant?: React.AriaAttributes['aria-activedescendant'];
  ariaAutoComplete?: React.AriaAttributes['aria-autocomplete'];
  ariaControls?: React.AriaAttributes['aria-controls'];
  ariaDescribedBy?: React.AriaAttributes['aria-describedby'];
  ariaExpanded?: React.AriaAttributes['aria-expanded'];
  ariaLabel?: React.AriaAttributes['aria-label'];
  ariaLabelledBy?: React.AriaAttributes['aria-labelledby'];
  ariaMultiline?: React.AriaAttributes['aria-multiline'];
  ariaOwns?: React.AriaAttributes['aria-owns'];
  ariaRequired?: React.AriaAttributes['aria-required'];
  autoCapitalize?: HTMLDivElement['autocapitalize'];
  'data-testid'?: string | null | undefined;
} & Omit<React.AllHTMLAttributes<HTMLDivElement>, 'placeholder'>;

function ContentEditableElementImpl(
  {
    ariaActiveDescendant,
    ariaAutoComplete,
    ariaControls,
    ariaDescribedBy,
    ariaExpanded,
    ariaLabel,
    ariaLabelledBy,
    ariaMultiline,
    ariaOwns,
    ariaRequired,
    autoCapitalize,
    className,
    id,
    role = 'textbox',
    spellCheck = true,
    style,
    tabIndex,
    'data-testid': testid,
    ...rest
  }: Props,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditable, setEditable] = useState(false);

  const handleRef = (rootElement: null | HTMLElement) => {
    // defaultView is required for a root element.
    // In multi-window setups, the defaultView may not exist at certain points.
    if (
      rootElement &&
      rootElement.ownerDocument &&
      rootElement.ownerDocument.defaultView
    ) {
      editor.setRootElement(rootElement);
    } else {
      editor.setRootElement(null);
    }
  };

  useLayoutEffect(() => {
    setEditable(editor.isEditable());
    return editor.registerEditableListener((currentIsEditable) => {
      setEditable(currentIsEditable);
    });
  }, [editor]);

  return (
    <div
      {...rest}
      aria-activedescendant={isEditable ? ariaActiveDescendant : undefined}
      aria-autocomplete={isEditable ? ariaAutoComplete : 'none'}
      aria-controls={isEditable ? ariaControls : undefined}
      aria-describedby={ariaDescribedBy}
      aria-expanded={
        isEditable && role === 'combobox' ? !!ariaExpanded : undefined
      }
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiline={ariaMultiline}
      aria-owns={isEditable ? ariaOwns : undefined}
      aria-readonly={isEditable ? undefined : true}
      aria-required={ariaRequired}
      autoCapitalize={autoCapitalize}
      className={className}
      contentEditable={isEditable}
      data-testid={testid}
      id={id}
      ref={mergeRefs(ref, handleRef)}
      role={isEditable ? role : undefined}
      spellCheck={spellCheck}
      style={style}
      tabIndex={tabIndex}
    />
  );
}

export const ContentEditableElement = forwardRef(ContentEditableElementImpl);
