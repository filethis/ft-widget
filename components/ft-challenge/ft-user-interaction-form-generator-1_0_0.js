/*
Copyright 2018 FileThis, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { light } from "../../mx-design-tokens/index.js";


// InteractionFormGenerator_1_0_0

export function InteractionFormGenerator_1_0_0(view, widgetMap)
{
    this.rootView = view;
    this.widgetMap = widgetMap;

    this.submitButton = null;
}

InteractionFormGenerator_1_0_0.prototype.getResponse = function()
{
    return this.response;
};

InteractionFormGenerator_1_0_0.prototype.clear = function()
{
    // Clean up from the last time we used the root view
    this.rootView.removeEventListener('keyup', this.onKeyUp.bind(this));
    this.rootView.removeEventListener('paper-radio-group-changed', this.onPaperRadioGroupChanged.bind(this));
    this.rootView.removeEventListener('change', this.onChange.bind(this));

    if (this.deferButton)
    {
        // this.deferButton.removeEventListener('click', this.onDeferButtonClicked.bind(this));
        this.deferButton = null;
    }

    if (this.submitButton)
    {
        // this.submitButton.removeEventListener('click', this.onSubmitButtonClicked.bind(this));
        this.submitButton = null;
    }

    // Remove all children of the root view
    for (var child = this.rootView.lastChild;
         child != null;
         child = this.rootView.lastChild)
    {
        this.rootView.removeChild(child);
    }
    //flush();

    // Clear the widget map
    for (var property in this.widgetMap)
    {
        if (this.widgetMap.hasOwnProperty(property))
            delete this.widgetMap[property];
    }
};

InteractionFormGenerator_1_0_0.prototype.begin = function()
{
    this.clear();

    this.generating = true;

    // Add listener to all user-input changes so we can validate the form and enable the "OK" button
    this.rootView.addEventListener('keyup', this.onKeyUp.bind(this));
    this.rootView.addEventListener('paper-radio-group-changed', this.onPaperRadioGroupChanged.bind(this));
    this.rootView.addEventListener('change', this.onChange.bind(this));

    this.rootView.style.display = "flex";
    this.rootView.style.flexDirection = "column";
    this.rootView.style.alignItems = "stretch";
};

InteractionFormGenerator_1_0_0.prototype.end = function()
{
    this.generating = false;

    this.validate();
};

InteractionFormGenerator_1_0_0.prototype.generateId = function()
{
    // Ignore. No need to display this.
};

InteractionFormGenerator_1_0_0.prototype.generateTitle = function(title)
{
    var element = document.createElement('div');
    this.rootView.appendChild(element);
    element.innerHTML = title;
    element.style.fontSize = "16pt";
    element.style.fontWeight = "bold";
    element.style.lineHeight = "20pt";
    element.style.color = "#121417";
    element.style.fontSize = light.FontSize.H2 + "px";
    element.style.fontWeight = light.FontWeight.Bold;
    element.style.lineHeight = light.LineHeight.H2 + "px";
    element.style.color = light.Color.Neutral900;
};

InteractionFormGenerator_1_0_0.prototype.generateStaticText = function(id, text)
{
    var element = document.createElement('div');
    this.rootView.appendChild(element);

    element.innerHTML = text;
    element.style.paddingTop = "12px";

    this.widgetMap[id] = element;
};

InteractionFormGenerator_1_0_0.prototype.generateTextInput = function(id, label, sensitive)
{
    var element = document.createElement('mwc-textfield');
    element.setAttribute('outlined', 'outlined');
    element.style.setProperty("--mdc-theme-primary", light.Color.Primary300);
    element.style.setProperty("--mdc-text-field-outlined-idle-border-color", light.Color.Neutral600);
    element.style.setProperty("--mdc-text-field-outlined-hover-border-color", light.Color.Neutral900);
    element.style.setProperty("--mdc-text-field-ink-color", light.Color.Neutral900);
    element.style.setProperty("--mdc-text-field-label-ink-color", light.Color.Neutral600);
    this.rootView.appendChild(element);

    // TODO: Fix this in the server code
    // Remove trailing colon, if present
    label = label.replace(/\:$/, '');

    element.label = label;
    element.style.marginTop = "20px";

    var type;
    if (sensitive)
        type = 'password';
    else
        type = 'text';
    element.type = type;

    this.widgetMap[id] = element;
};

InteractionFormGenerator_1_0_0.prototype.generateChoices = function(id, label, choices, defaultChoiceId, suggestedWidgetType)
{
    // Vertical container
    var container = document.createElement('div');
    this.rootView.appendChild(container);
    container.style.marginTop = "12px";

    // Create choice group
    switch (suggestedWidgetType)
    {
        // Short lists
        case "radiobutton":
        case "list-box":  // TODO
        default:
            this._generateRadiobuttonChoices(id, label, choices, defaultChoiceId, container);
            break;

        // Long lists
        case "combo-box":
        case "drop-down-menu":  // TODO
            this._generateMenuChoices(id, label, choices, defaultChoiceId, container);
            break;
    }
};

InteractionFormGenerator_1_0_0.prototype._generateRadiobuttonChoices = function(id, label, choices, defaultChoiceId, container)
{
    // Group label
    var groupLabel = document.createElement('div');
    container.appendChild(groupLabel);
    groupLabel.innerHTML = label;
    groupLabel.style.marginTop = "9px";

    // Group
    var group = document.createElement('paper-radio-group');
    group.id = "choice-group";
    container.appendChild(group);
    this.widgetMap[id] = group;

    // Choices in group
    var choicesCount = choices.length;
    for (var choicesIndex = 0; choicesIndex < choicesCount; choicesIndex++)
    {
        var choice = choices[choicesIndex];

        // Formfield parent for radiobutton
        var formfield = document.createElement('mwc-formfield');
        formfield.label = choice.label;
        formfield.style.marginLeft = "16px";
        group.appendChild(formfield);

        // Radiobutton
        var radiobutton = document.createElement('mwc-radio');
        formfield.appendChild(radiobutton);
        radiobutton.id = choice.id;
        radiobutton.name = choice.id;

        // If a default choice was specified and this is it, select this radiobutton
        if (defaultChoiceId && radiobutton.id == defaultChoiceId)
            group.select(choice.id);

        this.widgetMap[choice.id] = radiobutton;
    }
};

InteractionFormGenerator_1_0_0.prototype._generateMenuChoices = function(id, label, choices, defaultChoiceId, container)
{
    // Dropdown menu
    var dropdownMenu = document.createElement('select');
    container.appendChild(dropdownMenu);
    dropdownMenu.style.marginTop = "9px";
    dropdownMenu.label = label;
    this.widgetMap[id] = dropdownMenu;

    // Items
    var choicesCount = choices.length;
    for (var choicesIndex = 0; choicesIndex < choicesCount; choicesIndex++)
    {
        var choice = choices[choicesIndex];

        var item = document.createElement('option');
        dropdownMenu.appendChild(item);
        item.value = choice.id;
        item.text = choice.label;

        // If a default choice was specified and this is it, select this item
        if (defaultChoiceId && item.value == defaultChoiceId)
            dropdownMenu.value = item.value;

        this.widgetMap[choice.id] = null;  // Unlike radiobutton clusters, there is no widget for each menu choice
    }
};

InteractionFormGenerator_1_0_0.prototype.onKeyUp = function()
{
    this.onUserInput();
};

InteractionFormGenerator_1_0_0.prototype.onPaperRadioGroupChanged = function()
{
    this.onUserInput();
};

InteractionFormGenerator_1_0_0.prototype.onChange = function()
{
    this.onUserInput();
};

InteractionFormGenerator_1_0_0.prototype.onUserInput = function()
{
    // Suppress when we are compiling
    if (this.generating)
        return;

    this.validate();

    var event = new CustomEvent('entered-data-changed');
    this.rootView.dispatchEvent(event);
};

InteractionFormGenerator_1_0_0.prototype.validate = function()
{
    if (this.submitButton == null)
        return;

    var enabled = true;

    if (enabled)
        enabled = this.allTextInputsValid();
    if (enabled)
        enabled = this.allRadiobuttonGroupsValid();
    if (enabled)
        enabled = this.allMenusValid();

    this.submitButton.disabled = !enabled;
};

InteractionFormGenerator_1_0_0.prototype.allTextInputsValid = function()
{
    // For each text input in the form
    var elements = this.rootView.querySelectorAll("mwc-textfield");
    var count = elements.length;
    for (var index = 0; index < count; index++)
    {
        var element = elements[index];
        var value = element.value;
        if (value === undefined)
            return false;
        if (value.length === 0)
            return false;
    }
    return true;
};

InteractionFormGenerator_1_0_0.prototype.allRadiobuttonGroupsValid = function()
{
    // For each radiobutton group in the form
    var radioButtonGroups = this.rootView.querySelectorAll("#choice-group");
    var groupCount = radioButtonGroups.length;
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++)
    {
        var radioButtonGroup = radioButtonGroups[groupIndex];

        // Is one of the radiobuttons in this group selected?
        var someRadiobuttonIsSelected = false;
        var radiobuttons = radioButtonGroup.querySelectorAll("mwc-radio");
        var radiobuttonCount = radiobuttons.length;
        for (var radiobuttonIndex = 0; radiobuttonIndex < radiobuttonCount; radiobuttonIndex++)
        {
            var radioButton = radiobuttons[radiobuttonIndex];
            if (radioButton.checked)
            {
                someRadiobuttonIsSelected = true;
                break;
            }
        }
        if (!someRadiobuttonIsSelected)
            return false;
    }
    return true;
};

InteractionFormGenerator_1_0_0.prototype.allMenusValid = function()
{
    // For each menu in the form
    var menus = this.rootView.querySelectorAll("select");
    var count = menus.length;
    for (var index = 0; index < count; index++)
    {
        var menu = menus[index];
        var value = menu.value;
        if (!value)
            return false;
    }
    return true;
};
