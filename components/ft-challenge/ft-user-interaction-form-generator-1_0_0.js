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

import { dom, flush } from '@polymer/polymer/lib/legacy/polymer.dom.js'


// InteractionFormGenerator_1_0_0

export function InteractionFormGenerator_1_0_0(polymer, view, widgetMap, maxWidth)
{
    this.polymer = polymer;
    this.rootView = view;
    this.widgetMap = widgetMap;
    this.maxWidth = maxWidth;

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
    for (var child = dom(this.rootView).lastChild;
         child != null;
         child = dom(this.rootView).lastChild)
    {
        dom(this.rootView).removeChild(child);
    }
    flush();

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

    this.rootView.style.minWidth = "500px";
    this.rootView.style.padding = "16px";
};

InteractionFormGenerator_1_0_0.prototype.end = function()
{
    // Horizontal container for defer and submit buttons
    var div = document.createElement('div');
    dom(this.rootView).appendChild(div);
    div.classList.add("horizontal");
    div.classList.add("end-justified");
    div.classList.add("layout");
    div.style.width = "100%";
    div.style.paddingTop = "20px";

    // Spacer to push button to right
//            var springSpacer = document.createElement('div');
//            dom(div).appendChild(springSpacer);
//            springSpacer.style.width = "100%";

    // TODO: Something needs to remove the button event listeners when we are done with the form...

    // Defer button
    var deferButton = document.createElement('paper-button');
    var submitFalse = false;
    deferButton.addEventListener('click', this.onButtonClicked.bind(this, "_deferButton", "defer", submitFalse));
    dom(div).appendChild(deferButton);
    deferButton.raised = true;
    deferButton.style.height = "36px";
    deferButton.style.background = "white";
    dom(deferButton).textContent = 'Answer Later';
    this.deferButton = deferButton;

    // Spacer between buttons
    var spacer = document.createElement('div');
    dom(div).appendChild(spacer);
    spacer.style.width = "20px";

    // Submit button
    var submitButton = document.createElement('paper-button');
    var submitTrue = true;
    submitButton.addEventListener('click', this.onButtonClicked.bind(this, "_submitButton", "submit", submitTrue));
    dom(div).appendChild(submitButton);
    submitButton.raised = true;
    submitButton.style.width = "60px";
    submitButton.style.height = "36px";
    submitButton.style.background = "white";
    dom(submitButton).textContent = 'OK';
    this.submitButton = submitButton;

    // Flush all changes
    flush();

    this.generating = false;

    this.validate();
};

InteractionFormGenerator_1_0_0.prototype.generateId = function(id)
{
    // Ignore. No need to display this.
};

InteractionFormGenerator_1_0_0.prototype.generateTitle = function(title)
{
    var element = document.createElement('div');
    dom(this.rootView).appendChild(element);
    element.innerHTML = title;
    element.style.paddingBottom = "10px";
    element.style.fontSize = "20pt;";
};

InteractionFormGenerator_1_0_0.prototype.generateStaticText = function(id, text)
{
    var element = document.createElement('div');
    dom(this.rootView).appendChild(element);

    element.innerHTML = text;
    element.style.maxWidth = this.maxWidth;
    element.style.paddingTop = "12px";

    this.widgetMap[id] = element;
};

InteractionFormGenerator_1_0_0.prototype.generateTextInput = function(id, label, sensitive)
{
    var element = document.createElement('paper-input');
    dom(this.rootView).appendChild(element);

    element.label = label;
    element.style.paddingTop = "12px";

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
    dom(this.rootView).appendChild(container);
    this.polymer.toggleClass("layout", true, container);
    this.polymer.toggleClass("vertical", true, container);
    container.style.width = "100%";
    container.style.paddingTop = "12px";

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
    dom(container).appendChild(groupLabel);
    groupLabel.innerHTML = label;
    groupLabel.style.maxWidth = this.maxWidth;
    groupLabel.style.marginBottom = "12px";
    groupLabel.style.paddingTop = "12px";

    // Group
    var group = document.createElement('paper-radio-group');
    group.id = "choice-group";
    dom(container).appendChild(group);
    group.style.maxWidth = this.maxWidth;
    this.widgetMap[id] = group;

    // Choices in group
    var choicesCount = choices.length;
    for (var choicesIndex = 0; choicesIndex < choicesCount; choicesIndex++)
    {
        var choice = choices[choicesIndex];

        // Radiobutton
        var radiobutton = document.createElement('paper-radio-button');
        dom(group).appendChild(radiobutton);
        radiobutton.id = choice.id;
        radiobutton.name = choice.id;
        dom(radiobutton).textContent = choice.label;
        radiobutton.style.paddingLeft = "20px";

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
    dom(container).appendChild(dropdownMenu);
    dropdownMenu.style.maxWidth = this.maxWidth;
    dropdownMenu.style.paddingTop = "12px";
    dropdownMenu.label = label;
    this.widgetMap[id] = dropdownMenu;

    // Items
    var choicesCount = choices.length;
    for (var choicesIndex = 0; choicesIndex < choicesCount; choicesIndex++)
    {
        var choice = choices[choicesIndex];

        var item = document.createElement('option');
        dom(dropdownMenu).appendChild(item);
        item.value = choice.id;
        item.text = choice.label;

        // If a default choice was specified and this is it, select this item
        if (defaultChoiceId && item.value == defaultChoiceId)
            dropdownMenu.value = item.value;

        this.widgetMap[choice.id] = null;  // Unlike radiobutton clusters, there is no widget for each menu choice
    }
};

InteractionFormGenerator_1_0_0.prototype.onButtonClicked = function(id, action, submit)
{
    var event = new CustomEvent('button-clicked',
        {
            bubbles: true,
            composed: true,
            detail:
                {
                    id:id,
                    action:action,
                    submit:submit
                }
        });
    this.rootView.dispatchEvent(event);
};

InteractionFormGenerator_1_0_0.prototype.onKeyUp = function(event)
{
    this.onUserInput();
};

InteractionFormGenerator_1_0_0.prototype.onPaperRadioGroupChanged = function(event)
{
    this.onUserInput();
};

InteractionFormGenerator_1_0_0.prototype.onChange = function(event)
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
    var elements = dom(this.rootView).querySelectorAll("paper-input");
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
    var radioButtonGroups = dom(this.rootView).querySelectorAll("#choice-group");
    var groupCount = radioButtonGroups.length;
    for (var groupIndex = 0; groupIndex < groupCount; groupIndex++)
    {
        var radioButtonGroup = radioButtonGroups[groupIndex];

        // Is one of the radiobuttons in this group selected?
        var someRadiobuttonIsSelected = false;
        var radiobuttons = dom(radioButtonGroup).querySelectorAll("paper-radio-button");
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
    var menus = dom(this.rootView).querySelectorAll("select");
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
