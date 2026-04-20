"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPaths = void 0;
exports.userPaths = {
    /**
     * 🔓 CRIAR USUÁRIO
     */
    '/users': {
        post: {
            tags: ['Users'],
            summary: 'Criar usuário',
            description: 'Cria um novo usuário no sistema',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/CreateUser' }
                    }
                }
            },
            responses: {
                201: { description: 'Usuário criado com sucesso' },
                400: { description: 'Dados inválidos' }
            }
        },
        /**
         * 🔐 LISTAR USUÁRIOS (RBAC)
         */
        get: {
            tags: ['Users'],
            summary: 'Listar usuários (paginado com filtros)',
            description: 'Requer permissão: user:read',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    schema: { type: 'integer', example: 1 }
                },
                {
                    name: 'limit',
                    in: 'query',
                    schema: { type: 'integer', example: 10 }
                },
                {
                    name: 'name',
                    in: 'query',
                    schema: { type: 'string', example: 'gabriel' },
                    description: 'Filtrar por nome (busca parcial)'
                },
                {
                    name: 'email',
                    in: 'query',
                    schema: { type: 'string', example: 'email.com' },
                    description: 'Filtrar por email (busca parcial)'
                },
                {
                    name: 'search',
                    in: 'query',
                    schema: { type: 'string', example: 'gabriel' },
                    description: 'Busca por nome OU email'
                },
                {
                    name: 'startDate',
                    in: 'query',
                    schema: { type: 'string', example: '2026-01-01' },
                    description: 'Data inicial'
                },
                {
                    name: 'endDate',
                    in: 'query',
                    schema: { type: 'string', example: '2026-12-31' },
                    description: 'Data final'
                },
                {
                    name: 'sort',
                    in: 'query',
                    schema: { type: 'string', example: 'name:asc' },
                    description: 'Ordenação (ex: name:asc, createdAt:desc)'
                }
            ],
            responses: {
                200: { description: 'Lista de usuários retornada com sucesso' },
                401: { description: 'Não autenticado' },
                403: { description: 'Sem permissão (user:read)' }
            }
        }
    },
    /**
     * 🔓 LOGIN (LEGADO - opcional remover depois)
     */
    '/users/login': {
        post: {
            tags: ['Users'],
            summary: 'Login (legado)',
            description: 'Recomendado usar /auth/login',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Login' }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Token JWT',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                401: { description: 'Credenciais inválidas' }
            }
        }
    },
    /**
     * 🔐 USUÁRIO LOGADO
     */
    '/users/me': {
        get: {
            tags: ['Users'],
            summary: 'Retorna usuário logado',
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Usuário retornado com sucesso',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/User' }
                        }
                    }
                },
                401: { description: 'Não autenticado' }
            }
        }
    },
    /**
     * 🔐 OPERAÇÕES POR ID
     */
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Buscar usuário por ID',
            description: 'Requer permissão: user:read',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                200: { description: 'Usuário encontrado' },
                401: { description: 'Não autenticado' },
                403: { description: 'Sem permissão' },
                404: { description: 'Usuário não encontrado' }
            }
        },
        put: {
            tags: ['Users'],
            summary: 'Atualizar usuário',
            description: 'Requer permissão: user:update',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateUser' }
                    }
                }
            },
            responses: {
                200: { description: 'Usuário atualizado com sucesso' },
                400: { description: 'Dados inválidos' },
                403: { description: 'Sem permissão (user:update)' }
            }
        },
        delete: {
            tags: ['Users'],
            summary: 'Deletar usuário',
            description: 'Requer permissão: user:delete',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }
            ],
            responses: {
                200: { description: 'Usuário deletado com sucesso' },
                403: { description: 'Sem permissão (user:delete)' }
            }
        }
    }
};
