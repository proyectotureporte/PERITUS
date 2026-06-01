// Helpers de bajo nivel (pool, query, transacciones, builders)
export * from './pool';

// Repositorios por entidad. Uso: `import { cases } from '@/lib/db'; cases.getCaseById(...)`
// PERITUS comparte la BD `cnp`; solo expone las entidades que su portal/landing usan.
export * as crmClient from './crmClient';
export * as crmUser from './crmUser';
export * as cases from './cases';
export * as caseEvent from './caseEvent';
export * as caseDocument from './caseDocument';
export * as quote from './quote';
export * as registroPeritus from './registroPeritus';
export * as cotizacion from './cotizacion';
