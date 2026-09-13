## Metadata and Docs URLs

**URL:** https://fastapi.tiangolo.com/tutorial/metadata/

**Contents:**
- Metadata and Docs URLs¶
- Metadata for API¶
- License identifier¶
- Metadata for tags¶
  - Create metadata for tags¶
  - Use your tags¶
  - Check the docs¶
  - Order of tags¶
- OpenAPI URL¶
- Docs URLs¶

You can customize several metadata configurations in your FastAPI application.

You can set the following fields that are used in the OpenAPI specification and the automatic API docs UIs:

You can set them as follows:

You can write Markdown in the description field and it will be rendered in the output.

With this configuration, the automatic API docs would look like:

Since OpenAPI 3.1.0 and FastAPI 0.99.0, you can also set the license_info with an identifier instead of a url.

You can also add additional metadata for the different tags used to group your path operations with the parameter openapi_tags.

It takes a list containing one dictionary for each tag.

Each dictionary can contain:

Let's try that in an example with tags for users and items.

Create metadata for your tags and pass it to the openapi_tags parameter:

Notice that you can use Markdown inside of the descriptions, for example "login" will be shown in bold (login) and "fancy" will be shown in italics (fancy).

You don't have to add metadata for all the tags that you use.

Use the tags parameter with your path operations (and APIRouters) to assign them to different tags:

Read more about tags in Path Operation Configuration.

Now, if you check the docs, they will show all the additional metadata:

The order of each tag metadata dictionary also defines the order shown in the docs UI.

For example, even though users would go after items in alphabetical order, it is shown before them, because we added their metadata as the first dictionary in the list.

By default, the OpenAPI schema is served at /openapi.json.

But you can configure it with the parameter openapi_url.

For example, to set it to be served at /api/v1/openapi.json:

If you want to disable the OpenAPI schema completely you can set openapi_url=None, that will also disable the documentation user interfaces that use it.

You can configure the two documentation user interfaces included:

For example, to set Swagger UI to be served at /documentation and disable ReDoc:

**Examples:**

Example 1 (python):
```python
from fastapi import FastAPI

description = """
ChimichangApp API helps you do awesome stuff. 🚀

