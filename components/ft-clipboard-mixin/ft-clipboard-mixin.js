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


export const FtClipboardMixin = (base) =>
    class FtClipboard extends base
    {
        copyTextToClipboard(text)
        {
            // Create a parentless textarea element
            var textarea = document.createElement('textarea');

            // Configure it such that it has very little chance of being visible to the user
            textarea.style.position = 'fixed';
            textarea.style.top = 0;
            textarea.style.left = 0;
            textarea.style.padding = 0;
            textarea.style.border = 'none';
            textarea.style.outline = 'none';
            textarea.style.boxShadow = 'none';
            textarea.style.background = 'transparent';
            textarea.style.width = '2em';  // Setting to 1px or 1em uses negative values in some browsers
            textarea.style.height = '2em';

            // Inject the given text into it
            textarea.value = text;

            // Temporarily give it a parent.
            this.shadowRoot.appendChild(textarea);

            try
            {
                // Select all of the text
                textarea.select();

                // Execute the copy command
                var result = document.execCommand('copy');
                if (!result || result === "unsuccessful")
                    console.log("ft-clipboard-mixin: Copy failed.");
            }
            catch (err)
            {
                console.log("ft-clipboard-mixin: Copy failed with thrown error.");
            }

            // Remove element from its temporary parent
            this.shadowRoot.removeChild(textarea);
        }
    }

