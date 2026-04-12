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
         * 🔐 LISTAR USUÁRIOS (ADMIN)
         */
        get: {
            tags: ['Users'],
            summary: 'Listar usuários (paginado com filtros)',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'page',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 1 }
                },
                {
                    name: 'limit',
                    in: 'query',
                    required: false,
                    schema: { type: 'integer', example: 10 }
                },
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: 'gabriel' },
                    description: 'Filtrar por nome (busca parcial)'
                },
                {
                    name: 'email',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: 'email.com' },
                    description: 'Filtrar por email (busca parcial)'
                },
                {
                    name: 'search',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: 'gabriel' },
                    description: 'Busca por nome OU email'
                },
                {
                    name: 'startDate',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: '2026-01-01' },
                    description: 'Data inicial'
                },
                {
                    name: 'endDate',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: '2026-12-31' },
                    description: 'Data final'
                },
                {
                    name: 'sort',
                    in: 'query',
                    required: false,
                    schema: { type: 'string', example: 'name:asc' },
                    description: 'Ordenação (ex: name:asc, createdAt:desc)'
                }
            ],
            responses: {
                200: { description: 'Lista de usuários' },
                401: { description: 'Não autorizado' },
                403: { description: 'Acesso negado' }
            }
        }
    },
    /**
     * 🔓 LOGIN
     */
    '/users/login': {
        post: {
            tags: ['Users'],
            summary: 'Login',
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
                401: { description: 'Não autorizado' }
            }
        }
    },
    /**
     * 🔐 BUSCAR USUÁRIO POR ID (ADMIN)
     */
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Buscar usuário por ID',
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
                404: { description: 'Usuário não encontrado' }
            }
        },
        /**
         * 🔐 ATUALIZAR USUÁRIO
         */
        put: {
            tags: ['Users'],
            summary: 'Atualizar usuário',
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
                200: { description: 'Usuário atualizado' },
                400: { description: 'Dados inválidos' }
            }
        },
        /**
         * 🔐 DELETAR USUÁRIO (ADMIN)
         */
        delete: {
            tags: ['Users'],
            summary: 'Deletar usuário',
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
                200: { description: 'Usuário deletado' },
                403: { description: 'Acesso negado' }
            }
        }
    }
};
