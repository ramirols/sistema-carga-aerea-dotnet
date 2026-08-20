"use client"

import {
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    KeyRound,
    LoaderCircle,
    Plus,
    Power,
    PowerOff,
    ShieldCheck,
    UserCog,
} from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { sileo } from "sileo"
import { z } from "zod"

import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { DataPagination } from "@/components/shared/data-pagination"
import { DataToolbar } from "@/components/shared/data-toolbar"
import { PageHeader } from "@/components/shared/page-header"
import {
    TableEmpty,
    TableLoading,
} from "@/components/shared/table-states"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTablePagination } from "@/hooks/use-table-pagination"
import { apiFetch } from "@/lib/api/client"
import { formatDateTime } from "@/lib/formatters"
import { notifyError } from "@/lib/notify-error"
import type {
    CambiarPasswordRequest,
    CambiarRolUsuarioRequest,
    CrearUsuarioRequest,
    RolResponse,
    UsuarioResponse,
} from "@/types/api"

const createUserSchema = z.object({
    nombreUsuario: z
        .string()
        .trim()
        .min(3, "El usuario debe tener al menos 3 caracteres.")
        .max(50, "El usuario no debe superar 50 caracteres."),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres."),
    rolId: z
        .number()
        .int()
        .positive("Selecciona un rol."),
})

const roleSchema = z.object({
    rolId: z
        .number()
        .int()
        .positive("Selecciona un rol."),
})

const passwordSchema = z
    .object({
        passwordActual: z
            .string()
            .min(1, "Ingresa la contraseña actual."),
        passwordNueva: z
            .string()
            .min(8, "La nueva contraseña debe tener al menos 8 caracteres."),
        confirmarPassword: z
            .string()
            .min(1, "Confirma la nueva contraseña."),
    })
    .refine(
        (values) =>
            values.passwordNueva === values.confirmarPassword,
        {
            message: "Las contraseñas no coinciden.",
            path: ["confirmarPassword"],
        },
    )

type CreateUserFormValues = z.infer<
    typeof createUserSchema
>

type RoleFormValues = z.infer<typeof roleSchema>

type PasswordFormValues = z.infer<
    typeof passwordSchema
>

type StatusAction = "activar" | "desactivar"

export default function UsuariosPage() {
    const queryClient = useQueryClient()

    const [createOpen, setCreateOpen] = useState(false)
    const [roleOpen, setRoleOpen] = useState(false)
    const [passwordOpen, setPasswordOpen] =
        useState(false)
    const [statusOpen, setStatusOpen] = useState(false)

    const [selected, setSelected] =
        useState<UsuarioResponse | null>(null)

    const [statusAction, setStatusAction] =
        useState<StatusAction>("desactivar")

    const usersQuery = useQuery({
        queryKey: ["usuarios"],
        queryFn: () =>
            apiFetch<UsuarioResponse[]>("/Usuarios"),
    })

    const rolesQuery = useQuery({
        queryKey: ["roles"],
        queryFn: () =>
            apiFetch<RolResponse[]>("/Roles"),
    })

    const createForm = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            nombreUsuario: "",
            password: "",
            rolId: 0,
        },
    })

    const roleForm = useForm<RoleFormValues>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            rolId: 0,
        },
    })

    const passwordForm =
        useForm<PasswordFormValues>({
            resolver: zodResolver(passwordSchema),
            defaultValues: {
                passwordActual: "",
                passwordNueva: "",
                confirmarPassword: "",
            },
        })

    useEffect(() => {
        if (!createOpen) return

        createForm.reset({
            nombreUsuario: "",
            password: "",
            rolId: 0,
        })
    }, [createOpen, createForm])

    useEffect(() => {
        if (!roleOpen || !selected) return

        const currentRole = rolesQuery.data?.find(
            (role) =>
                role.nombre.toLowerCase() ===
                selected.rol.toLowerCase(),
        )

        roleForm.reset({
            rolId: currentRole?.id ?? 0,
        })
    }, [
        roleOpen,
        selected,
        rolesQuery.data,
        roleForm,
    ])

    useEffect(() => {
        if (!passwordOpen) return

        passwordForm.reset({
            passwordActual: "",
            passwordNueva: "",
            confirmarPassword: "",
        })
    }, [passwordOpen, passwordForm])

    const createMutation = useMutation({
        mutationFn: (values: CreateUserFormValues) => {
            const request: CrearUsuarioRequest = values

            return apiFetch<UsuarioResponse>("/Usuarios", {
                method: "POST",
                body: JSON.stringify(request),
            })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            })

            sileo.success({
                title: "Usuario registrado",
                description:
                    "El usuario se creó correctamente.",
            })

            setCreateOpen(false)
        },
        onError: (error) =>
            notifyError(error, "No se pudo crear el usuario"),
    })

    const roleMutation = useMutation({
        mutationFn: (values: RoleFormValues) => {
            if (!selected) {
                throw new Error("No se seleccionó un usuario.")
            }

            const request: CambiarRolUsuarioRequest = values

            return apiFetch<void>(
                `/Usuarios/${selected.id}/rol`,
                {
                    method: "PATCH",
                    body: JSON.stringify(request),
                },
            )
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            })

            sileo.success({
                title: "Rol actualizado",
                description:
                    "El nuevo rol fue asignado correctamente.",
            })

            setRoleOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(error, "No se pudo cambiar el rol"),
    })

    const passwordMutation = useMutation({
        mutationFn: (values: PasswordFormValues) => {
            if (!selected) {
                throw new Error("No se seleccionó un usuario.")
            }

            const request: CambiarPasswordRequest = {
                passwordActual: values.passwordActual,
                passwordNueva: values.passwordNueva,
            }

            return apiFetch<void>(
                `/Usuarios/${selected.id}/password`,
                {
                    method: "PATCH",
                    body: JSON.stringify(request),
                },
            )
        },
        onSuccess: () => {
            sileo.success({
                title: "Contraseña actualizada",
                description:
                    "La contraseña fue modificada correctamente.",
            })

            setPasswordOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(
                error,
                "No se pudo cambiar la contraseña",
            ),
    })

    const statusMutation = useMutation({
        mutationFn: ({
            id,
            action,
        }: {
            id: number
            action: StatusAction
        }) =>
            apiFetch<void>(`/Usuarios/${id}/${action}`, {
                method: "POST",
            }),
        onSuccess: async (_, variables) => {
            await queryClient.invalidateQueries({
                queryKey: ["usuarios"],
            })

            sileo.success({
                title:
                    variables.action === "activar"
                        ? "Usuario activado"
                        : "Usuario desactivado",
                description:
                    "El estado fue actualizado correctamente.",
            })

            setStatusOpen(false)
            setSelected(null)
        },
        onError: (error) =>
            notifyError(
                error,
                "No se pudo cambiar el estado del usuario",
            ),
    })

    const filter = useCallback(
        (user: UsuarioResponse, search: string) =>
            user.nombreUsuario
                .toLowerCase()
                .includes(search) ||
            user.rol.toLowerCase().includes(search),
        [],
    )

    const pagination = useTablePagination({
        data: usersQuery.data ?? [],
        filter,
    })

    function openRole(user: UsuarioResponse) {
        setSelected(user)
        setRoleOpen(true)
    }

    function openPassword(user: UsuarioResponse) {
        setSelected(user)
        setPasswordOpen(true)
    }

    function openStatus(
        user: UsuarioResponse,
        action: StatusAction,
    ) {
        setSelected(user)
        setStatusAction(action)
        setStatusOpen(true)
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Usuarios"
                description="Administra el acceso del personal al sistema."
                icon={UserCog}
                actions={
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus />
                        Nuevo usuario
                    </Button>
                }
            />

            <Card className="overflow-hidden py-0">
                <DataToolbar
                    value={pagination.search}
                    onChange={pagination.setSearch}
                    placeholder="Buscar por usuario o rol..."
                />

                <CardContent className="p-0">
                    {usersQuery.isLoading ? (
                        <TableLoading />
                    ) : pagination.paginatedData.length === 0 ? (
                        <TableEmpty message="No se encontraron usuarios." />
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-6">
                                            Usuario
                                        </TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Fecha de creación</TableHead>
                                        <TableHead className="w-44 text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {pagination.paginatedData.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                                                        {user.nombreUsuario
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium">
                                                            {user.nombreUsuario}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            ID #{user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1.5"
                                                >
                                                    <ShieldCheck className="size-3" />
                                                    {user.rol}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        user.activo
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={
                                                        user.activo
                                                            ? "bg-emerald-600 hover:bg-emerald-600"
                                                            : ""
                                                    }
                                                >
                                                    {user.activo
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </Badge>
                                            </TableCell>

                                            <TableCell>
                                                {formatDateTime(
                                                    user.fechaCreacion,
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Cambiar rol"
                                                        onClick={() => openRole(user)}
                                                    >
                                                        <ShieldCheck className="size-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Cambiar contraseña"
                                                        onClick={() =>
                                                            openPassword(user)
                                                        }
                                                    >
                                                        <KeyRound className="size-4" />
                                                    </Button>

                                                    {user.activo ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Desactivar"
                                                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                                            onClick={() =>
                                                                openStatus(
                                                                    user,
                                                                    "desactivar",
                                                                )
                                                            }
                                                        >
                                                            <PowerOff className="size-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="Activar"
                                                            className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                                            onClick={() =>
                                                                openStatus(
                                                                    user,
                                                                    "activar",
                                                                )
                                                            }
                                                        >
                                                            <Power className="size-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>

                <DataPagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    pageSize={pagination.pageSize}
                    onPageChange={pagination.setPage}
                    onPageSizeChange={pagination.setPageSize}
                />
            </Card>

            {/* Crear usuario */}
            <Dialog
                open={createOpen}
                onOpenChange={(open) => {
                    if (!createMutation.isPending) {
                        setCreateOpen(open)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nuevo usuario</DialogTitle>
                        <DialogDescription>
                            Registra las credenciales y el rol del usuario.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="create-user-form"
                        className="space-y-5 py-2"
                        onSubmit={createForm.handleSubmit((values) =>
                            createMutation.mutate(values),
                        )}
                    >
                        <Controller
                            name="nombreUsuario"
                            control={createForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre de usuario
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="off"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Ejemplo: operador01"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={createForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Contraseña
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="password"
                                        autoComplete="new-password"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Mínimo 8 caracteres"
                                    />

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="rolId"
                            control={createForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Rol</FieldLabel>

                                    <Select
                                        value={
                                            field.value > 0
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger
                                            aria-invalid={fieldState.invalid}
                                        >
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {rolesQuery.data?.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </form>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={createMutation.isPending}
                            onClick={() => setCreateOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="create-user-form"
                            disabled={createMutation.isPending}
                        >
                            {createMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Crear usuario
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cambiar rol */}
            <Dialog
                open={roleOpen}
                onOpenChange={(open) => {
                    if (!roleMutation.isPending) {
                        setRoleOpen(open)
                        if (!open) setSelected(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cambiar rol</DialogTitle>
                        <DialogDescription>
                            Selecciona el nuevo rol de{" "}
                            <strong>{selected?.nombreUsuario}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="role-form"
                        className="py-2"
                        onSubmit={roleForm.handleSubmit((values) =>
                            roleMutation.mutate(values),
                        )}
                    >
                        <Controller
                            name="rolId"
                            control={roleForm.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Rol</FieldLabel>

                                    <Select
                                        value={
                                            field.value > 0
                                                ? String(field.value)
                                                : ""
                                        }
                                        onValueChange={(value) =>
                                            field.onChange(Number(value))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {rolesQuery.data?.map((role) => (
                                                <SelectItem
                                                    key={role.id}
                                                    value={String(role.id)}
                                                >
                                                    {role.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {fieldState.invalid && (
                                        <FieldError
                                            errors={[fieldState.error]}
                                        />
                                    )}
                                </Field>
                            )}
                        />
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setRoleOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="role-form"
                            disabled={roleMutation.isPending}
                        >
                            {roleMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Guardar rol
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cambiar contraseña */}
            <Dialog
                open={passwordOpen}
                onOpenChange={(open) => {
                    if (!passwordMutation.isPending) {
                        setPasswordOpen(open)
                        if (!open) setSelected(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Cambiar contraseña
                        </DialogTitle>

                        <DialogDescription>
                            Actualiza la contraseña de{" "}
                            <strong>{selected?.nombreUsuario}</strong>.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        id="password-form"
                        className="space-y-5 py-2"
                        onSubmit={passwordForm.handleSubmit(
                            (values) =>
                                passwordMutation.mutate(values),
                        )}
                    >
                        {[
                            {
                                name: "passwordActual" as const,
                                label: "Contraseña actual",
                                placeholder: "Ingresa la contraseña actual",
                            },
                            {
                                name: "passwordNueva" as const,
                                label: "Nueva contraseña",
                                placeholder: "Mínimo 8 caracteres",
                            },
                            {
                                name: "confirmarPassword" as const,
                                label: "Confirmar contraseña",
                                placeholder: "Repite la nueva contraseña",
                            },
                        ].map((input) => (
                            <Controller
                                key={input.name}
                                name={input.name}
                                control={passwordForm.control}
                                render={({ field, fieldState }) => (
                                    <Field
                                        data-invalid={fieldState.invalid}
                                    >
                                        <FieldLabel htmlFor={field.name}>
                                            {input.label}
                                        </FieldLabel>

                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="password"
                                            autoComplete="new-password"
                                            placeholder={input.placeholder}
                                            aria-invalid={fieldState.invalid}
                                        />

                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            />
                        ))}
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPasswordOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            form="password-form"
                            disabled={passwordMutation.isPending}
                        >
                            {passwordMutation.isPending && (
                                <LoaderCircle className="animate-spin" />
                            )}
                            Cambiar contraseña
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={statusOpen}
                onOpenChange={setStatusOpen}
                title={
                    statusAction === "activar"
                        ? "Activar usuario"
                        : "Desactivar usuario"
                }
                description={
                    statusAction === "activar"
                        ? `¿Deseas habilitar el acceso de “${selected?.nombreUsuario ?? ""}”?`
                        : `¿Deseas impedir temporalmente el acceso de “${selected?.nombreUsuario ?? ""}”?`
                }
                confirmLabel={
                    statusAction === "activar"
                        ? "Activar"
                        : "Desactivar"
                }
                pending={statusMutation.isPending}
                onConfirm={() => {
                    if (selected) {
                        statusMutation.mutate({
                            id: selected.id,
                            action: statusAction,
                        })
                    }
                }}
            />
        </div>
    )
}