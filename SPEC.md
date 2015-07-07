Design of this bug database
---------------------------

This is a working draft and the intention is to have some discussion.

The database lives under a directory `issues`, this is designed for humans so I don't think it should be `.issues` or `mydit`.

Under `issues` the directories represent issue status, recommended statuses are `open`, `closed`, `inprogress`. Tools
should handle these statuses as expected by default, but should allow other statuses - even in other languages, we'll
 have to work out a way to configure that.

Status directories can be suffixed with `:<author>`, ie. `inprogress:platy` or `closed:Mike`. Status directories in this
way mean that task status change and assignment will appear in VCS history as
'file moved from issues/open to issues/inprogress:platy' so we get issue history for free!

Inside status directories we put the issues, they are named as their issue title - separating words with spaces!! This
is supposed to be human readable!

Swim lane names are included in the filename before the issue title, separated by ':' and optional whitespace.

The issues are markdown files, with a markdown extension such as '*.md'; they containing the body of the issue. We need formatting for the bug messages, I'm not ready to give up GFM for writing bug reports. Something extra might be needed for other pieces of data but lets try out the simplest form first.
