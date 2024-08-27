const AuthLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return(
        <div className="flex items-center justify-center h-full">
            {children}
    </div>
    );
}

export default AuthLayout;

/*
AuthLayout: This is the name of the function. In React, functions that return UI elements are often called components.
The part inside the parentheses ({ children }: { children: React.ReactNode; }) defines the parameters the function accepts.
i. Destructuring Assignment
{ children }: This is using a feature called destructuring assignment. 
It extracts the children property from the input object. In React, children refers to any nested elements or components passed between the opening and closing tags of a component.
: { children: React.ReactNode; }: This is a type annotation provided by TypeScript. It specifies the shape and types of the expected input.
React.ReactNode: This type represents any valid React content, including elements, strings, numbers, or even null and undefined. It's essentially anything that can be rendered by React.
=> { ... }: This is known as an arrow function. It's a concise way to write functions in JavaScript. The code inside the curly braces { ... } is the body of the function, which defines what the function does.
a. return Statement
The return statement specifies what the function outputs when it's called. In this case, it's returning some JSX code.
b. JSX
JSX stands for JavaScript XML. It's a syntax extension for JavaScript that allows you to write HTML-like code inside JavaScript, which React then transforms into actual HTML elements on the web page.

d. {children}
{children}: This syntax is used to render any nested content passed to the AuthLayout component. It's a placeholder that gets replaced with actual content when the component is used.
a. export default
In JavaScript and TypeScript, modules are files that can export code to be used in other files. The export default statement exports a default value from a module.

export: Makes parts of the code (functions, variables, classes) available for use in other files.
default: Specifies that this is the default export of the module, allowing it to be imported without specifying a specific name.
b. AuthLayout
This is the function (component) we're exporting. By exporting it, we can import and use AuthLayout in other parts of our application.
*/

/*
Summary:

We defined a React functional component named AuthLayout using an arrow function.
This component accepts a single prop called children, which can be any valid React content.
The component returns a <div> element with specific CSS classes applied to it for styling purposes.
Inside the <div>, it renders the children prop, allowing any nested components or elements to be displayed within this styled container.
Finally, we export the AuthLayout component as the default export from this module, so it can be easily imported and used elsewhere in the application.

*/