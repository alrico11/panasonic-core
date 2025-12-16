import { Action, UserService, CreateUserDto, UpdateUserDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UserService) {}

    /**
     * Get all users
     * GET /users
     */
    @Get()
    @Action('search', 'user')
    async listAllUsers() {
        const users = await this.usersService.listAllUsers();
        return {
            success: true,
            message: 'Users fetched successfully',
            data: users,
        };
    }

    /**
     * Get users with pagination
     * GET /users/pagination?page=1&limit=10
     */
    @Get('pagination')
    @Action('search', 'user')
    async getPaginated(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ) {
        const result = await this.usersService.getUsersWithPagination(page, limit);
        return {
            success: true,
            message: 'Users fetched with pagination',
            ...result,
        };
    }

    /**
     * Search users by email
     * GET /users/search/email?email=example
     */
    @Get('search/email')
    @Action('search', 'user')
    async searchByEmail(@Query('email') email: string) {
        const users = await this.usersService.searchByEmail(email);
        return {
            success: true,
            message: 'Users search by email completed',
            data: users,
        };
    }

    /**
     * Search users by name
     * GET /users/search/name?firstName=John&lastName=Doe
     */
    @Get('search/name')
    @Action('search', 'user')
    async searchByName(
        @Query('firstName') firstName: string,
        @Query('lastName') lastName?: string,
    ) {
        const users = await this.usersService.searchByName(firstName, lastName);
        return {
            success: true,
            message: 'Users search by name completed',
            data: users,
        };
    }

    /**
     * Get users by role ID
     * GET /users/role/:roleId
     */
    @Get('role/:roleId')
    @Action('search', 'user')
    async getUsersByRoleId(@Param('roleId') roleId: string) {
        const users = await this.usersService.getUsersByRoleId(Number(roleId));
        return {
            success: true,
            message: 'Users fetched by role',
            data: users,
        };
    }

    /**
     * Get user by ID
     * GET /users/:id
     */
    @Get(':id')
    @Action('detail', 'user')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findUserById(Number(id));
        return {
            success: true,
            message: 'User fetched successfully',
            data: user,
        };
    }

    /**
     * Create a new user
     * POST /users
     */
    @Post()
    @Action('create', 'user')
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.createUser(createUserDto);
        return {
            success: true,
            message: 'User created successfully',
            data: user,
        };
    }

    /**
     * Update user
     * PATCH /users/:id
     */
    @Patch(':id')
    @Action('edit', 'user')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        const user = await this.usersService.updateUser(Number(id), updateUserDto);
        return {
            success: true,
            message: 'User updated successfully',
            data: user,
        };
    }

    /**
     * Delete user
     * DELETE /users/:id
     */
    @Delete(':id')
    @Action('delete', 'user')
    async remove(@Param('id') id: string) {
        const result = await this.usersService.deleteUser(Number(id));
        return {
            success: true,
            message: result.message,
            data: result,
        };
    }
}
