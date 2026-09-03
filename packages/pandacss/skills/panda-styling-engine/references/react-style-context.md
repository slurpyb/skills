# React Style-Context Component

Load when independently rendered React parts must share one slot recipe's resolved classes and variants.

## Choose this shape

Use `createStyleContext` for compound APIs whose parts may be reordered, nested, or portaled while remaining in one React tree. A direct slot wrapper is simpler when one component owns the complete DOM structure.

## Keep responsibilities separate

The behavior root owns state and accessibility. The style provider owns recipe variant selection and carries only the slot-class map. Compose both providers at the public `Root`.

Create one style context per component family. Type it from the generated slot recipe so provider variant props and slot keys stay synchronized with codegen. Add a framework client directive only to the smallest context-owning module when the framework requires one.

## Provider contract

`withProvider(Component, slot)` must:

1. split recipe variant props from component props;
2. resolve the slot recipe once;
3. provide the complete class map;
4. merge the selected generated slot class with the consumer `className`;
5. forward all remaining props and the ref to `Component`.

Variant props belong on the provider so every part receives one coherent selection.

## Part contract

`withContext(Component, slot)` reads the class map, merges the selected slot class before the consumer class, and forwards props and refs unchanged. Give each wrapper a qualified display name. Report a clear usage error when a styled part requires a missing provider.

Preserve the behavior primitive's polymorphism mechanism and prop types. Follow the package's established ref convention for its supported React peer range.

```tsx
const { withProvider, withContext } = createStyleContext(tabs);
export const TabsRoot = withProvider(Behavior.Root, 'root');
export const TabsList = withContext(Behavior.List, 'list');
export const TabsTrigger = withContext(Behavior.Trigger, 'trigger');
export const TabsContent = withContext(Behavior.Content, 'content');
```

React context crosses portals, so portaled content retains its slot class map. DOM inheritance does not cross a portal; keep theme and required custom-property boundaries explicit at the portal container.

## Exports and verification

Export qualified parts individually and through the component namespace. Test nested instances, portaled parts, provider absence, class merge order, ref delivery, variant propagation, and server/client parity.

Next: for anatomy and behavior contracts load [react-component-api.md](./react-component-api.md); for fixed structure load [react-slot-component.md](./react-slot-component.md).
